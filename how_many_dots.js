var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);
//    effect.eyeSep = - effect.eyeSep;

    scene = new THREE.Scene();


    // add a cube in there
    var geometry = new THREE.CubeGeometry(100,100,100);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff88});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(500, 200, 0);

    scene.add(mesh);

    var geometry = new THREE.SphereGeometry(10,3,3);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});

    var i;
    var j;
    var k;
    for (i = 200; i < 1000; i+=50) {
	for (j = 200; j < 1000; j+=50) {
	    for (k = 200; k < 1000; k+=50) {
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(500+k, 200+j, -100-i);
		scene.add(mesh);
	    }
	}
    }

    //    var geometry = new THREE.SphereGeometry(10,5,5);
    //    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    //    var mesh = new THREE.Mesh(geometry, material);
    //    mesh.position.set(500, 200, -100);


    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 2200);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
	camera.position.x + 0.1,
	camera.position.y,
	camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    function setOrientationControls(e) {
	if (!e.alpha) {
	    return;
	}

	controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);


    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(light);

    var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
    });

    var geometry = new THREE.PlaneGeometry(1000, 1000);

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);
}

function render(dt) {
    effect.render(scene, camera);
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}
