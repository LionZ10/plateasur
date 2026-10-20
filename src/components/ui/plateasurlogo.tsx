export default function PlateaSurLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* ISOTIPO CIRCULAR REDONDO */}
      <div className="relative w-10 h-10 bg-zinc-950 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-between p-1 shadow-[0_0_12px_rgba(16,185,129,0.35)] overflow-hidden select-none shrink-0">
        
        {/* ÁREA DE FÚTBOL PLANA */}
        <div className="relative w-7 h-3.5 flex flex-col items-center justify-start -mt-1.5 z-10">
          {/* Área Penal Grande */}
          <div className="absolute w-6 h-3.5 border-b-[1.5px] border-x-[1.5px] border-emerald-400 bg-emerald-500/5 flex justify-center">
            {/* Área Chica */}
            <div className="w-3.5 h-1.5 border-b-[1.5px] border-x-[1.5px] border-emerald-400 bg-emerald-500/5"></div>
          </div>
        </div>

        {/* PUNTO PENAL (Mucho más chico, corrido bien arriba, casi pegado al área) */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[3.5px] h-[3.5px] bg-emerald-400 rounded-full shadow-[0_0_4px_#10b981] z-10 shrink-0 aspect-square"></div>

        {/* SIGLA PS INTEGRADA EN LA BASE (Tirada bien abajo en absolute para dejar aire) */}
        <div className="absolute bottom-[2.5px] left-1/2 -translate-x-1/2 z-10">
          <span className="font-black text-[9px] text-white italic tracking-tighter">
            P<span className="text-emerald-400">S</span>
          </span>
        </div>
      </div>

      {/* BLOQUE DE TEXTOS ALINEADOS EN COLUMNA */}
      <div className="flex flex-col justify-center -space-y-0">
        {/* TITULO PRINCIPAL */}
        <span className="font-black text-lg tracking-wider text-white uppercase italic leading-none">
          PLATEA<span className="text-emerald-400">SUR</span>
        </span>
        
        {/* SUBTITULO ABAJO */}
        <span className="font-bold text-[9px] tracking-[0.2em] text-emerald-400/90 uppercase italic leading-none pl-0">
          INDUMENTARIA FUTBOLERA
        </span>
      </div>
    </div>
  );
}