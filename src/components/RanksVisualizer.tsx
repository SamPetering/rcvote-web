import { COLORS } from '@/lib/colors';
export function RanksVisualizer() {
  return (
    <div className="aspect-square w-full">
      <RankElement
        backgroundColor={COLORS.purple['600']}
        animation="rank1Animation"
      />
      <RankElement
        backgroundColor={COLORS.red['500']}
        animation="rank2Animation"
      />
      <RankElement
        backgroundColor={COLORS.blue['500']}
        animation="rank3Animation"
      />
      <RankElement
        backgroundColor={COLORS.orange['400']}
        animation="rank4Animation"
      />
    </div>
  );
}
function RankElement({
  backgroundColor,
  animation,
}: {
  backgroundColor: string;
  animation?: string;
}) {
  return (
    <div
      style={{
        animation: `${animation} 18s infinite cubic-bezier(.3,1,.1,1)`,
      }}
      className="flex h-1/4 flex-col justify-center overflow-visible"
    >
      <div
        style={{ backgroundColor }}
        className="relative h-5/6 rounded-lg shadow-md sm:rounded-xl"
      >
        <div className="absolute left-[4%] top-[20%] h-[17%] w-2/5 rounded-full bg-slate-800 bg-opacity-10" />
        <div className="absolute left-[4%] top-[50%] h-[12%] w-4/5 rounded-full bg-slate-800 bg-opacity-10" />
        <div className="absolute left-[4%] top-[70%] h-[12%] w-3/5 rounded-full bg-slate-800 bg-opacity-10" />
      </div>
    </div>
  );
}
