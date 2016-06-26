// main field for game object
var Context = {
    game: new Phaser.Game(screen.width - 50, screen.height - 200, Phaser.CANVAS, 'Ultimate Fighting', {
        preload: preload,
        create: create,
        update: update
    }),
    width: 800,
    height: 500
};
// information of fireball attack
var Attack = {
        fireBall: null,
        fireRate: 100,
        nextFire: 0
    };
    // fields for players
var playerManager, currentPlayer, enemyManager, enemyGroup, cursors;

/* preload function that initializes graphics */
function preload() {
    Context.game.load.spritesheet('enemy', 'assets/image/enemy/enemy.png', 32, 32, 10);
    Context.game.load.image('bullet', 'assets/image/player/fireball.png');

    // initialize players
    currentPlayer = new Player('player1');
}

/* create function that register more things for objects */
function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    Context.game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = Context.game.input.keyboard.createCursorKeys();
    Context.game.stage.backgroundColor = '#313131';

    // fireball attributes
    Attack.fireBall = Context.game.add.group();
    Attack.fireBall.enableBody = true;
    Attack.fireBall.physicsBodyType = Phaser.Physics.ARCADE;
    Attack.fireBall.createMultiple(50, 'bullet');
    Attack.fireBall.setAll('checkWorldBounds', true);
    Attack.fireBall.setAll('outOfBoundsKill', true);

    // enemies attributes
    enemyManager = new EnemyManager();
    enemyGroup = Context.game.add.group();
    enemyGroup.enableBody = true;

    for (var i = 0; i < 10; i++) {
        enemyManager.pushEnemy(new Enemy());
    }
    playerManager = new PlayerManager();
    playerManager.pushPlayer(currentPlayer);
    playerManager.addPlayersToWorld();
}


/* udpate function that refresh latest progress */
function update() {
    Context.game.physics.arcade.overlap(currentPlayer.player, enemyGroup, hitEnemy, null, this);
    //  Reset the players velocity (movement)
    currentPlayer.player.body.velocity.x = 0;
    currentPlayer.player.body.velocity.y = 0;
    currentPlayer.player.rotation = Context.game.physics.arcade.angleToPointer(currentPlayer.player);

    // fire ball activation
    if (Context.game.input.activePointer.isDown) {
        fire();
    }

    // player position
    if (cursors.left.isDown) {
        //  Move to the left
        currentPlayer.player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        //  Move to the right
        currentPlayer.player.body.velocity.x = 150;
    }
    if (cursors.up.isDown) {
        // Move up
        currentPlayer.player.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
        // Move down
        currentPlayer.player.body.velocity.y = 150;
    }
}

/* fire function for shooting */
function fire() {
    if (Context.game.time.now > Attack.nextFire && Attack.fireBall.countDead() > 0) {
        Attack.nextFire = Context.game.time.now + Attack.fireRate;
        var bullet = Attack.fireBall.getFirstDead();
        bullet.reset(currentPlayer.player.x - 8, currentPlayer.player.y - 8);
        Context.game.physics.arcade.moveToPointer(bullet, 300);
    }
}

/*
 * A class that manage all players in the game
 */
var PlayerManager = function() {
    var list = [];

    function pushPlayer(player) {
        list.push(player);
    }

    function removePlayer(player) {
        list.remove(player);
        player.player.kill();
    }

    function update() {
        for (var player in list) {
            //player.update();
        }
    }

    function addPlayersToWorld() {
        for (var i = 0; i < list.length; i++) {
            list[i].addPlayerToWorld();
        }
    }

    return {
        pushPlayer: pushPlayer,
        removePlayer: removePlayer,
        addPlayersToWorld: addPlayersToWorld,
        update: update
    };
};

/*
 * A class that make a new player to the game
 */
var Player = function(name) {
    // initialize player's name and add it to the game object
    var playerName = name;
    var health = 100;

    this.player = null;
    Context.game.load.image(name, 'assets/image/player/player1left.png');

    this.getName = function() {
        return playerName;
    };

    this.reduceHP = function(damage) {
        health -= damage;
        if (health <= 0) {
            this.player.kill();
        }
    };

    this.addPlayerToWorld = function() {
        this.player = Context.game.add.sprite(0, 0, playerName);
        this.player.anchor.set(0.5);
        Context.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.allowRotation = false;
        this.player.body.collideWorldBounds = true;
    };

};

function EnemyManager() {
    var list = [];

    function pushEnemy(enemy) {
        enemy.spawnEnemy();
        list.push(enemy);
    }

    function removeEnemy(enemy) {
        list.remove(enemy);
        enemy.enemy.kill();
    }

    function update() {}

    return {
        pushEnemy: pushEnemy,
        removeEnemy: removeEnemy,
        update: update
    };
}

function Enemy() {
    var health = 50;
    this.enemy = null;
    this.spawnEnemy = function() {
        this.enemy = enemyGroup.create(genRandom(Context.width), genRandom(Context.height), 'enemy');
        this.enemy.scale.setTo(2, 2);
        this.enemy.animations.add('idle');
        this.enemy.animations.play('idle', 10, true);
    };
}

function genRandom(length) {
    return Math.floor(Math.random() * (length - 32)) + 32;
}

function hitEnemy(player, enemy) {
    enemy.kill();
    currentPlayer.reduceHP(30);
    enemyManager.pushEnemy(new Enemy());
}
