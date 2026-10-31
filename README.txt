AETHER DEMONLIST — QUICK START

Files:
- index.html: page structure
- style.css: visual design
- script.js: loads, filters, searches and sorts levels
- levels.json: level database

RUN:
1. Put all four files in the same folder.
2. Open that folder in Visual Studio Code.
3. Install/use the Live Server extension.
4. Right-click index.html and choose "Open with Live Server".

Important: Do not open index.html by double-clicking it (file://). Browsers block fetch()
for local JSON files in that mode. Use Live Server or another local web server.

EDITING LEVELS:
Open levels.json. Add a new numbered entry inside "Levels", using:
{
  "LevelName": "Example Level",
  "CreatorUser": "Creator",
  "Verificator": null,
  "TypeOfDemon": 1,
  "ClubstepDifficulty": 2.5,
  "Thumbnail": "https://example.com/thumbnail.png"
}

TypeOfDemon:
1 = Easy Demon
2 = Medium Demon
3 = Hard Demon
4 = Insane Demon
5 = Extreme Demon

ClubstepDifficulty is the numeric ranking value. Higher values appear first when
"Hardest first" is selected. If unknown, use null; those levels appear after levels
with a numeric value. The sample values for Deadlocked, Theory of Everything 2 and
Clubstep are null because no ClubstepDifficulty values were supplied.
