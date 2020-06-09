if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;
var uniforms, material, mesh;
var mouseX = 0, mouseY = 0,
lat = 0, lon = 0, phy = 0, theta = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var composer;

init();
renderer.render( scene, camera );
//composer.render( );

// Returns the contents of a text file
var getSourceSynch = function (url) {
    var req = new XMLHttpRequest ();
    req.open ("GET", url, false);
    req.send (null);
    return (req.status === 200)? req.responseText: null;
};

// Returns the object contained in the file. Json
var loadJSON = function (url) {
    return JSON.parse (getSourceSynch (url));
};

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    // Create Light
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.set(0.0,0.0,1);
    scene.add(light);
    var texture = THREE.ImageUtils.loadTexture( "test.jpg", new THREE.Texture(), function () {
        render();
    });

    // Returns the contents of a text file
    var getSourceSynch = function (url) {
        var req = new XMLHttpRequest ();
        req.open ("GET", url, false);
        req.send (null);
        return (req.status === 200)? req.responseText: null;
    };


    uniforms = {
        texture: { type: "t", value: texture}, 
        resolution: { type: "v2", value: new THREE.Vector2() },
        brightness:  {type: "f", value: .6},
        contrast: {type: "f", value: -.3},
        size: {type: "f", value: 0},
        amount: {type: "f", value: 1}

    };

    material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: getSourceSynch("filters/bright_contrast_vert.shdr"),
        fragmentShader: getSourceSynch("filters/bright_contrast_frag.shdr")
    });

    vig_material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: getSourceSynch("filters/bright_contrast_vert.shdr"),
        fragmentShader: getSourceSynch("filters/vignette_frag.shdr")
    });

    mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    container.appendChild( stats.domElement );


    onWindowResize();

    window.addEventListener( 'resize', onWindowResize, false );

    $(".brightness").on("change", function () {
        uniforms.brightness.value = $(this).val();
        mesh.material.fragmentShader = getSourceSynch("filters/bright_contrast_frag.shdr");
        mesh.material.needsUpdate = true;
        render();
        stats.update();
    });

    $(".contrast").on("change", function () {
        uniforms.contrast.value = $(this).val();
        mesh.material.fragmentShader = getSourceSynch("filters/bright_contrast_frag.shdr");
        mesh.material.needsUpdate = true;
        render();
        stats.update();

    });

    $(".vig_amount").on("change", function () {
        mesh.material.fragmentShader = getSourceSynch("filters/vignette_frag.shdr");
        uniforms.amount.value = $(this).val();
        mesh.material.needsUpdate = true;
        render();
        stats.update();

    });

    $( ":button" ).on("click", function () {
       
        var sceneRTT = new THREE.Scene();
        var light = new THREE.PointLight(0xFFFFFF);
        light.position.set(0.0,0.0,1);
        sceneRTT.add(light);
        rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
        var m =  new THREE.Mesh(new THREE.PlaneGeometry( 2, 2 ), material);
        sceneRTT.add(m);
        renderRTT(sceneRTT, rtTexture);
        uniforms.texture = rtTexture;
        //var texture = new  THREE.ImageUtils.loadTexture( imgData);        
        render();        



    });

    //animate()
    

}

function onWindowResize( event ) {

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function renderRTT(sceneRTT, texture) {
    renderer.render( sceneRTT, camera, texture );
}

function render() {

    //uniforms.time.value += 0.05;

    renderer.render( scene, camera );
    //renderer.clear(); 
    //composer.render(  );
}




