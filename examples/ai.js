/**
 * @file AI with State Machines
 * @description How to create simple game AI using state machines.
 * @difficulty 1
 * @tags ai
 * @minver 3001.0
 * @category concepts
 * @test
 */

// Use state() component to handle basic AI

// Start KAPLAY
kaplay();

// Load assets
loadSprite("bean", "/sprites/bean.png");
loadSprite("ghosty", "/sprites/ghosty.png");

// Some constants
const SPEED = 320;
const ENEMY_SPEED = 160;
const BULLET_SPEED = 800;

// Add player game object
const player = add([
    sprite("bean"),
    pos(80, 80),
    area(),
    anchor("center"),
]);

const enemy = add([
    sprite("ghosty"),
    pos(width() - 80, height() - 80),
    anchor("center"),
    // This enemy cycle between 3 states, and start from "idle" state
    state("move", ["idle", "attack", "move"]),
]);

// Run the callback once every time we enter "idle" state.
// Here we stay "idle" for 0.5 second, then enter "attack" state.
enemy.onStateEnter("idle", async () => {
    await wait(0.5);
    enemy.enterState("attack");
});

// When we enter "attack" state, we fire a bullet, and enter "move" state after 1 sec
enemy.onStateEnter("attack", async () => {
    // Don't do anything if player doesn't exist anymore
    if (player.exists()) {
        const dir = player.pos.sub(enemy.pos).unit();

        add([
            pos(enemy.pos),
            move(dir, BULLET_SPEED),
            rect(12, 12),
            area(),
            offscreen({ destroy: true }),
            anchor("center"),
            color(BLUE),
            "bullet",
        ]);
    }

    // Waits 1 second to make the enemy enter in "move" state
    await wait(1);
    enemy.enterState("move");
});

// When we enter "move" state, we stay there for 2 sec and then go back to "idle"
enemy.onStateEnter("move", async () => {
    await wait(2);
    enemy.enterState("idle");
});

// .onStateUpdate() is similar to .onUpdate(), it'll run every frame, but in this case
// Only when the current state is "move"
enemy.onStateUpdate("move", () => {
    // We move the enemy in the direction of the player
    if (!player.exists()) return;
    const dir = player.pos.sub(enemy.pos).unit();
    enemy.move(dir.scale(ENEMY_SPEED));
});

// Taking a bullet makes us disappear
player.onCollide("bullet", (bullet) => {
    destroy(bullet);
    destroy(player);
    addKaboom(bullet.pos);
});

// Register input handlers & movement
onKeyDown("left", () => {
    player.move(-SPEED, 0);
});

onKeyDown("right", () => {
    player.move(SPEED, 0);
});

onKeyDown("up", () => {
    player.move(0, -SPEED);
});

onKeyDown("down", () => {
    player.move(0, SPEED);
});
