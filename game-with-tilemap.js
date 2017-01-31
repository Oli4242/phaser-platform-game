// based on http://www.lessmilk.com/tutorial/2d-platformer-phaser
var mainState = {
    preload: function () {
        game.load.crossOrigin = 'anonymous';
        game.load.spritesheet('spritesheet', 'assets/spritesheet.png', 32, 32, -1, 1, 0); // coin, enemy, player, wall
    },

    create: function () {
        game.stage.backgroundColor = '#ffffff';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        this.player = game.add.sprite(90, 100, 'spritesheet', 2);

        behaviorPlugin = game.plugins.add(Phaser.Plugin.Behavior); // init the Behavior plugin

        behaviorPlugin.enable(this.player); // enable the plugin on the player

        this.player.behaviors.set('platformer', Phaser.Behavior.Platformer, {
            velocity: 300,
            jumpStrength: 450,
            gravity: 1300
        });

        // Map Builder
        this.coins = game.add.physicsGroup();
        // this.enemies = game.add.group();

        var level = [
            'xxxxxxxxxxxxxxxxxxxxxx',
            '!         !          x',
            '!                 o  x',
            '!         o          x',
            '!                    x',
            '!     o   !    x     x',
            'xxxxxxxxxxxxxxxx!!!!!x'
        ];
        this.map = game.add.tilemap();
        this.map.addTilesetImage('tiles', 'spritesheet', 32, 32, 1, 1);
        this.mapLayer = this.map.create('level', level[0].length, level.length, 32, 32);
        this.map.setCollision([1, 3], true, this.mapLayer);

        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {
                if (level[i][j] == 'x') {
                    this.map.putTile(3, j, i, this.mapLayer);
                } else if (level[i][j] == '!') {
                    this.map.putTile(1, j, i, this.mapLayer);
                } else if (level[i][j] == 'o') {
                    this.coins.create(32 * j, 32 * i, 'spritesheet', 0);
                }
            }
        }

        // collision handlers
        this.player.behaviors.set('collide-on-walls', Phaser.Behavior.CollisionHandler, {
            targets: this.mapLayer,
        });

        // (I'm not sure about how to handle this for now...)
        // this.player.behaviors.set('collide-on-enemy', Phaser.Behavior.CollisionHandler, {
        //     method: 'overlap',
        //     targets: this.enemies,
        //     collideCallback: this.restart
        // });

        this.player.behaviors.set('collect-coin', Phaser.Behavior.CollisionHandler, {
            method: 'overlap',
            targets: this.coins,
            collideCallback: this.takeCoin
        });
    },

    takeCoin: function (player, coin) {
        coin.kill();
    },

    restart: function () {
        game.state.start('main');
    }
};

var game = new Phaser.Game(768, 288), behaviorPlugin;
game.state.add('main', mainState);
game.state.start('main');
