# Skills del proyecto

Copiadas tal cual desde sus repos (licencia MIT):

| Skill | Origen | Commit |
|---|---|---|
| ui-ux-pro-max | nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/ui-ux-pro-max`) | 477bcb2 |
| taste-skill | Leonxlnx/taste-skill (`skills/taste-skill`) | b482f7a |
| playwright-skill | lackeyjb/playwright-skill (`skills/playwright-skill`) | dd47a6a |

Instaladas como plugins desde `.claude/settings.json`:

- `figma@claude-plugins-official`: skills de Figma + servidor MCP (https://mcp.figma.com/mcp, se autentica con OAuth vía `/mcp`)
- `superpowers@superpowers-dev`: obra/superpowers
- `supermemory@supermemory-plugins`: supermemoryai/claude-supermemory (necesita `SUPERMEMORY_CC_API_KEY`)

gstack (garrytan/gstack) es una instalación global y no va en el repo:

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Antes de usar playwright-skill por primera vez: `cd .claude/skills/playwright-skill && npm run setup`.
