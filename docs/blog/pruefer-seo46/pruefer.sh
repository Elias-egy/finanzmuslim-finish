#!/bin/zsh
# $1 = name (halal-blog-halal-etf-seo45 | seiten-blog-halal-etf-seo45), $2 = zusätzliche Tools
V=/Users/eliasel-gendy/Desktop/0_ABLAGE/AgenticOS/AgenticOS
S=/private/tmp/claude-501/-Users-eliasel-gendy/05157ca4-e20b-4abd-af99-e43aaaf94320/scratchpad
P=$V/fundament/grundlage/playbooks/finanzmuslim/pruefung
cd $V && claude -p "$(cat $V/fundament/grundlage/playbooks/finanzmuslim/pruefer-auftraege/$1.md)" --model opus --output-format json \
  --tools "Read,Grep,Glob,Write,Bash$2" \
  --allowedTools "Read,Grep,Glob,Write(/$P/$1.md),Bash(python3:*),Bash(grep:*),Bash(wc:*),Bash(sed:*),Bash(awk:*),Bash(node:*),Bash(curl:*),Bash(ls:*),Bash(cat:*),Bash(head:*),Bash(pdftotext:*)$2" \
  --permission-mode dontAsk --strict-mcp-config \
  --add-dir /Users/eliasel-gendy/Documents/dev/fm-seo23 --add-dir $S --add-dir /Users/eliasel-gendy/.claude/skills --add-dir /private/tmp \
  --settings '{"autoMemoryEnabled":false}' > $S/lauf-$1.json 2> $S/lauf-$1.err
echo "fertig $1 Ausgang $?"
