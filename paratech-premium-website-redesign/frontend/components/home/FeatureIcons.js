// Ícones fixos (decorativos) dos 8 cards de "Diferenciais" da Home, na mesma
// ordem de home.features. Só o texto (título/descrição) é editável pelo
// /admin/site — o ícone/cor fica preso ao índice pra não expor um editor de
// SVG no painel.
export const FEATURE_ICONS = [
  { iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 18, height: 18, borderRadius: "50%", border: "3px solid #E30613" }} /> },
  { iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 18, height: 18, borderRadius: 4, background: "#FFD400" }} /> },
  { iconBg: "rgba(35,38,43,.08)", icon: <div style={{ width: 18, height: 18, border: "3px solid #23262B", borderRadius: "50%", borderTopColor: "transparent" }} /> },
  { iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "16px solid #E30613" }} /> },
  { iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 20, height: 14, borderRadius: 3, border: "3px solid #FFD400" }} /> },
  { iconBg: "rgba(35,38,43,.08)", icon: <div style={{ width: 16, height: 16, background: "#23262B", transform: "rotate(45deg)" }} /> },
  { iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 20, height: 14, borderRadius: 2, border: "3px solid #E30613" }} /> },
  { iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#FFD400" }} /> },
];
