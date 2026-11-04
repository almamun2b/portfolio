import { CardGridSkeleton, HeaderSkeleton } from "@/components/admin/skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <HeaderSkeleton />
      <CardGridSkeleton count={2} />
    </div>
  );
}
