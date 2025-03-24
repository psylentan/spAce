This document outlines how and why scenes transition.

Contents:
Complete Scene Transition Diagram: Diagram showing which scene leads to which (e.g., StartScene → GameScene → EncounterScene → CardBattleScene → GameOverScene).

Conditions for Transitions: Define conditions for each transition. For example:

From GameScene → EncounterScene when player enters a specific area.

From GameOverScene → RebirthScene when the player chooses to continue with meta-upgrades.

Data Passed Between Scenes: Document what data gets passed (e.g., player stats, enemy data, encounter choice).

Scene Stack Management: How scenes stack on top of each other (like pause screen over GameScene), and when to pop scenes off the stack.

