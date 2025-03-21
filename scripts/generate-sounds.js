const fs = require('fs');
const { exec } = require('child_process');

// Ensure directories exist
const dirs = ['dist/assets/sounds', 'src/assets/sounds'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Generate sound files using SoX if available
const generateSounds = () => {
    const commands = [
        // Engine start sound - rising tone
        'sox -n src/assets/sounds/engine-start.ogg synth 0.5 sine 100-1000',
        
        // Engine stop sound - falling tone
        'sox -n src/assets/sounds/engine-stop.ogg synth 0.5 sine 1000-100',
        
        // Engine loop sound - constant tone
        'sox -n src/assets/sounds/engine-loop.ogg synth 1 sine 500',
        
        // Background music - simple 80s style tune
        'sox -n src/assets/sounds/space-arcade.ogg synth 4 sine 440 sine 880 remix - fade 0 4 2'
    ];

    commands.forEach(cmd => {
        exec(cmd, (error) => {
            if (error) {
                console.log('Warning: Could not generate sound files. Please provide your own .ogg files in src/assets/sounds/');
            }
        });
    });
};

generateSounds(); 