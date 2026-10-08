"""Deterministically generate the human checklist from the machine-readable backlog.

No time-dependent fields. Regeneration is safe and idempotent.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKLOG = ROOT / "ops" / "backlog.json"
CHECKLIST = ROOT / "docs" / "master-checklist.md"

def render(data):
    tasks = data["items"]
    baseline = data["baseline"]
    done = sum(t["status"] == "done" for t in tasks)
    current = sum(t["status"] == "in_progress" for t in tasks)
    open_tasks = sum(t["status"] in ("queued", "blocked") for t in tasks)
    cancelled = sum(t["status"] == "cancelled" for t in tasks)
    lines = [
        "# AI Race Gazette — checklist maestro de cierre",
        "",
        "> Archivo generado desde \`source/ops/backlog.json\`. Edita la cola, no las casillas de esta página. Regenera con \`python3 scripts/refresh_master_checklist.py\`.",
        "",
        "## Línea base histórica (no métricas vivas)",
        "",
        f"- Apertura: {data['asOf']}.",
        f"- Archivo inicial: {baseline['articles']} artículos, {baseline['reporterV2']} Reporter V2 y {baseline['legacy']} legacy.",
        f"- Calendario inicial: {baseline['registeredDays']} jornadas, {baseline['closedDays']} cerradas y {baseline['openDays']} abiertas.",
        f"- Commit base: \`{baseline['commit']}\`.",
        "",
        "## Progreso de la cola",
        "",
        f"- {len(data['phases'])} fases; {len(tasks)} tareas; {done} completadas; {current} en curso; {open_tasks} pendientes o bloqueadas; {cancelled} descartadas con razón.",
        "",
    ]
    for phase in data["phases"]:
        lines.extend([
            f"## {phase['id']} — {phase['title']}",
            "",
            f"**Estado:** {phase['status']}. **Gate:** {phase['gate']}",
            "",
        ])
        for task in tasks:
            if task["phase"] != phase["id"]:
                continue
            checked = "x" if task["status"] == "done" else " "
            lines.append(f"- [{checked}] **{task['id']}** · {task['priority']} · {task['status']} — {task['title']}")
            lines.append(f"  - Criterio: {task['acceptance']}")
            if task.get("date"):
                lines.append(f"  - Fecha investigada: {task['date']}")
            if task.get("dependsOn"):
                lines.append("  - Depende de: " + ", ".join(task["dependsOn"]))
            if task.get("evidenceCommit"):
                lines.append(f"  - Commit: \`{task['evidenceCommit']}\`")
            if task.get("verifiedEvidence"):
                lines.append(f"  - Evidencia: {task['verifiedEvidence'][0]}")
            if task.get("cancellationReason"):
                lines.append(f"  - Motivo de descarte: {task['cancellationReason']}")
        lines.append("")
    lines.extend([
        "## Reglas para nuevas tareas",
        "",
        "Toda tarea descubierta se agrega a \`source/ops/backlog.json\` con ID estable, fase, prioridad, dueño, evidencia y criterio de aceptación. No se borra historial ni se marca \`done\` sin evidencia. Un día con noticias no se considera completo sin doble revisión documentada. Concurrencia: releer \`main\` y deduplicar por \`eventKey\` antes de escribir.",
        "",
    ])
    return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Fail if tracked checklist differs from generated checklist")
    args = parser.parse_args()
    doc = json.loads(BACKLOG.read_text(encoding="utf-8"))
    expected = render(doc)
    if args.check:
        assert CHECKLIST.read_text(encoding="utf-8") == expected, "Checklist stale: run refresh_master_checklist.py"
        print("Master checklist synchronized")
    else:
        CHECKLIST.write_text(expected, encoding="utf-8")
        print("Master checklist generated from backlog.json")

if __name__ == "__main__":
    main()
