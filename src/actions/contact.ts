"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactEmail(values: ContactFormData) {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    console.error(
      "Brevo API key or sender email is missing in environment variables.",
    );
    return {
      success: false,
      message: "Server configuration error. Please try again later.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: name,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: BREVO_SENDER_EMAIL,
            name: "Portfolio Owner",
          },
        ],
        replyTo: {
          email: email,
          name: name,
        },
        subject: `Contact Form: ${subject}`,
        htmlContent: `
          <html>
            <head></head>
            <body>
              <h3>New Contact Message</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      return {
        success: false,
        message: "Failed to send email via Brevo.",
      };
    }

    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
