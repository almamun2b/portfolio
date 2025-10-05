import { NextResponse } from "next/server";

export const post = [
  {
    id: 6,
    title:
      "New............   From Water Scarcity to Sustainability: The Quiet Revolution in the Varendra Tract",
    content:
      "The arid Varendra Tract has long faced unique agricultural challenges. We take a deep dive into the grassroots and tech-driven water conservation projects that are turning the tide, showcasing the resilient communities and brilliant minds creating a sustainable future in one of Bangladesh's most vulnerable regions.",
    thumbnail:
      "https://res.cloudinary.com/dd0itvtvi/image/upload/v1757182054/we6w2pc7fzb-1757182051370-flowers-jpg.jpg.jpg",
    isFeatured: true,
    tags: ["test", "test", "test", "test"],
    views: 0,
    authorId: 1,
    createdAt: "2025-09-24T15:08:19.117Z",
    updatedAt: "2025-09-24T15:08:19.117Z",
    author: {
      id: 1,
      name: "Mamun",
      email: "mamun@gmail.com",
      password: "123456",
      role: "USER",
      phone: "01789456123",
      picture: null,
      status: "ACTIVE",
      isVerified: false,
      createdAt: "2025-09-22T15:43:29.330Z",
      updatedAt: "2025-09-22T15:43:29.330Z",
    },
  },
  {
    id: 5,
    title:
      "The Rise of the Digital Artisan: How Rajshahi's Silk Industry is Weaving a New Future Online",
    content:
      "The legendary silk of Rajshahi is getting a 21st-century makeover. This blog post highlights the local artisans and entrepreneurs who are embracing e-commerce and digital design to bring their timeless craft to a new global audience, preserving heritage while innovating for the future.",
    thumbnail:
      "https://images.pexels.com/photos/5436668/pexels-photo-5436668.jpeg",
    isFeatured: false,
    tags: [
      "E-commerce",
      "Artisan Crafts",
      "Rajshahi Silk",
      "Digital Bangladesh",
      "Small Business",
      "Heritage",
    ],
    views: 17,
    authorId: 1,
    createdAt: "2025-09-22T15:52:05.061Z",
    updatedAt: "2025-09-23T16:50:39.894Z",
    author: {
      id: 1,
      name: "Mamun",
      email: "mamun@gmail.com",
      password: "123456",
      role: "USER",
      phone: "01789456123",
      picture: null,
      status: "ACTIVE",
      isVerified: false,
      createdAt: "2025-09-22T15:43:29.330Z",
      updatedAt: "2025-09-22T15:43:29.330Z",
    },
  },
  {
    id: 4,
    title:
      "Beyond the Classroom: 5 Unforgettable Weekend Getaways from Rajshahi City",
    content:
      "Break free from your routine with these incredible weekend trips, all just a short journey from Rajshahi City. We guide you through historical marvels like the Puthia Temple Complex and the serene landscapes of the Padma River char lands, providing practical tips for the perfect escape.",
    thumbnail:
      "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg",
    isFeatured: false,
    tags: [
      "Travel Bangladesh",
      "Rajshahi",
      "Weekend Getaway",
      "Puthia",
      "Local Tourism",
      "Padma River",
    ],
    views: 14,
    authorId: 1,
    createdAt: "2025-09-22T15:51:34.935Z",
    updatedAt: "2025-09-24T12:56:41.813Z",
    author: {
      id: 1,
      name: "Mamun",
      email: "mamun@gmail.com",
      password: "123456",
      role: "USER",
      phone: "01789456123",
      picture: null,
      status: "ACTIVE",
      isVerified: false,
      createdAt: "2025-09-22T15:43:29.330Z",
      updatedAt: "2025-09-22T15:43:29.330Z",
    },
  },
  {
    id: 3,
    title:
      "The Future of Farming: How AgriTech is Transforming Rajshahi's Mango Orchards",
    content:
      "Step into the lush mango groves of Rajshahi, not just to taste the world-famous fruit, but to see the future of agriculture. This article explores the innovative agritech solutions—from drone-based monitoring to smart irrigation systems—that local farmers are adopting to boost yields, fight climate change, and secure their legacy.",
    thumbnail:
      "https://images.pexels.com/photos/4513980/pexels-photo-4513980.jpeg",
    isFeatured: true,
    tags: [
      "AgriTech",
      "Sustainable Farming",
      "Rajshahi Mango",
      "Innovation",
      "Climate Change",
      "Bangladesh",
    ],
    views: 6,
    authorId: 1,
    createdAt: "2025-09-22T15:51:13.360Z",
    updatedAt: "2025-09-23T16:50:40.075Z",
    author: {
      id: 1,
      name: "Mamun",
      email: "mamun@gmail.com",
      password: "123456",
      role: "USER",
      phone: "01789456123",
      picture: null,
      status: "ACTIVE",
      isVerified: false,
      createdAt: "2025-09-22T15:43:29.330Z",
      updatedAt: "2025-09-22T15:43:29.330Z",
    },
  },
  {
    id: 2,
    title:
      "Powering Progress: The Rise of Solar Microgrids in Rural Bangladesh",
    content:
      "Explore how off-grid solar solutions are bringing electricity to remote villages, empowering local businesses, and transforming lives, one community at a time.",
    thumbnail:
      "https://images.pexels.com/photos/5436668/pexels-photo-5436668.jpeg",
    isFeatured: false,
    tags: ["tag1", "tag2"],
    views: 3,
    authorId: 1,
    createdAt: "2025-09-22T15:44:03.768Z",
    updatedAt: "2025-09-23T16:50:39.972Z",
    author: {
      id: 1,
      name: "Mamun",
      email: "mamun@gmail.com",
      password: "123456",
      role: "USER",
      phone: "01789456123",
      picture: null,
      status: "ACTIVE",
      isVerified: false,
      createdAt: "2025-09-22T15:43:29.330Z",
      updatedAt: "2025-09-22T15:43:29.330Z",
    },
  },
];

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let filteredPosts = [...post];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply category filter
  if (category && category !== "All") {
    // For now, we'll use tags as categories since the API data doesn't have a category field
    filteredPosts = filteredPosts.filter((blog) =>
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  // Calculate pagination
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Transform data to match Blog interface
  const blogs = paginatedPosts.map((blog) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    description: blog.content.substring(0, 200) + "...",
    content: blog.content,
    image: blog.thumbnail,
    isFeatured: blog.isFeatured,
    category: blog.tags[0] || "General", // Use first tag as category
    tags: blog.tags,
    views: blog.views,
    authorId: blog.authorId,
    createdAt: new Date(blog.createdAt),
    updatedAt: new Date(blog.updatedAt),
    author: blog.author,
  }));

  const response = {
    success: true,
    message: "Blogs fetched successfully",
    data: {
      posts: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    },
  };

  return Response.json(response);
};

export const POST = async (request: Request) => {
  const blog = await request.json();
  const newBlog = {
    ...blog,
    id: post.length + 1,
  };
  post.push(blog);

  const newBlogRes = new NextResponse(JSON.stringify(newBlog), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return newBlogRes;
};
