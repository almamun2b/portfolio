import HtmlRenderer from "@/components/shared/HtmlRenderer";
import { Project } from "@/types";
import Image from "next/image";

interface ProjectDetailContentProps {
  project: Project;
}

const ProjectDetailContent = ({ project }: ProjectDetailContentProps) => {
  return (
    <div className="space-y-8">
      {/* Full Width Featured Image */}
      {project.image && (
        <div className="relative w-full aspect-[1200/400] rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Project Content */}
      <div className="">
        <HtmlRenderer content={project.content} />
      </div>
    </div>
  );
};

export default ProjectDetailContent;
