import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    PlaneGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Mesh,
    Vector2,
    Vector3,
    Color,
    Fog,
    DirectionalLight,
    PointLight,
    Object3D,
    CircleGeometry,
    Raycaster
} from './js/three.module.js'

import { TTFLoader } from './js/TTFLoader.js'
import { Font } from './js/FontLoader.js'
import { TextGeometry } from './js/TextGeometry.js'

let font
const loader = new TTFLoader()
loader.load('assets/123.ttf', json => {
    font = new Font(json)
    init()
    animate()
})

class ClockItem extends Object3D {
    constructor(text, link, position) {
        super()
        const circleGeo = new CircleGeometry(10, 32)
        const circleMat = new MeshBasicMaterial({ color: 0xffff00 })
        const circleMash = new Mesh(circleGeo, circleMat)
        this.add(circleMash)

        const textMat = new MeshPhongMaterial({ color: 0xffffff, flatShading: true })
        const textGeo = new TextGeometry(text, {
            font,
            size: 13,
            height: 14,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: true
        })
        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()
        const textMesh = new Mesh(textGeo, textMat)
        textMesh.link = link
        textMesh.position.x = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
        textMesh.position.y = 0.7 * textGeo.boundingBox.min.y
        textMesh.type = 'textMesh'
        this.add(textMesh)
        this.position.copy(position)
    }
}

class ClockSystem extends Object3D {
    constructor() {
        super()
        const firstPosition = new Vector3(0, 90, 1)
        const axis = new Vector3(0, 0, 1)
        const createPostion = (angle) => new Vector3().copy(firstPosition).applyAxisAngle(axis, Math.PI / 6 * angle)
        const items = [
            { text: '子', link: 'https://ntut-cg-lab.github.io/cg2021f-hw01-slime21023/', position: firstPosition },
            { text: '丑', link: 'https://ntut-cg-lab.github.io/cg2021f-hw02-slime21023/', position: createPostion(11) },
            { text: '寅', link: 'https://ntut-cg-lab.github.io/cg2021f-hw03-slime21023/', position: createPostion(10) },
            { text: '卯', link: 'https://ntut-cg-lab.github.io/cg2021f-hw04-slime21023/', position: createPostion(9) },
            { text: '辰', link: 'https://ntut-cg-lab.github.io/cg2021f-hw05-slime21023/', position: createPostion(8) },
            { text: '巳', link: 'https://ntut-cg-lab.github.io/cg2021f-hw06-slime21023/', position: createPostion(7) },
            { text: '午', link: 'https://ntut-cg-lab.github.io/cg2021f-hw07-slime21023/', position: createPostion(6) },
            { text: '未', link: 'https://ntut-cg-lab.github.io/cg2021f-hw08-slime21023/', position: createPostion(5) },
            { text: '申', link: 'https://ntut-cg-lab.github.io/cg2021f-hw09-slime21023/', position: createPostion(4) },
            { text: '酉', link: 'https://ntut-cg-lab.github.io/cg2021f-hw10-slime21023/', position: createPostion(3) },
            { text: '戌', link: 'https://ntut-cg-lab.github.io/cg2021f-hw11-slime21023/', position: createPostion(2) },
            { text: '亥', link: 'https://ntut-cg-lab.github.io/cg2021f-hw12-slime21023/', position: createPostion(1) }
        ]

        const createClockItem = ({ text, link, position }) => new ClockItem(text, link, position)
        items.forEach(item => this.add(createClockItem(item)))
        const circleGeo = new CircleGeometry(100, 32)
        const circleMat = new MeshBasicMaterial({ color: 0xff0000 })
        const circleMash = new Mesh(circleGeo, circleMat)
        circleMash.position.set(0, 0, 0)
        this.add(circleMash)
    }
}

class Plane extends Object3D {
    constructor() {
        super()
        this.add(new Mesh(
            new PlaneGeometry(10000, 10000),
            new MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
        ))
        const textMat = new MeshPhongMaterial({ color: 0xffffff, flatShading: true })
        const textGeo = new TextGeometry('高等計算機圖學作業', {
            font,
            size: 10,
            height: 12,
            curveSegments: 4,
            bevelThickness: 2,
            bevelSize: 1.5,
            bevelEnabled: true
        })
        textGeo.computeBoundingBox()
        textGeo.computeVertexNormals()
        const textMesh = new Mesh(textGeo, textMat)
        textMesh.position.x = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
        textMesh.position.y = -150
        this.add(textMesh)
    }
}

const container = document.getElementById('app')
const renderer = new WebGLRenderer({ antialias: true })
const camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500)
const scene = new Scene()
const mouse = new Vector2()
const raycaster = new Raycaster()

const onMouseDown = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    const intersects = raycaster.intersectObjects(scene.children)
    const target = intersects.filter(item => item.object.type === 'textMesh')
    if (target[0]) window.open(target[0].object.link, '_blank')
}

const onWindowResize = () => {
    windowHalfX = window.innerWidth / 2
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
    requestAnimationFrame(animate)
    const cameraTarget = new Vector3(0, 150, 0)
    camera.lookAt(cameraTarget)
    raycaster.setFromCamera(mouse, camera)
    renderer.render(scene, camera)
}

const init = () => {

    // camera
    camera.position.set(0, 400, 700)

    // scene
    scene.background = new Color(0x000000)
    scene.fog = new Fog(0x000000, 250, 1400)

    // lights
    const dirLight = new DirectionalLight(0xffffff, 0.125)
    dirLight.position.set(0, 0, 1).normalize()
    scene.add(dirLight)

    const pointLight = new PointLight(0xffffff, 1.5)
    pointLight.position.set(0, 100, 90)
    pointLight.color.setHSL(Math.random(), 1, 0.5)
    scene.add(pointLight)

    const plane = new Plane()
    plane.position.y = 50
    plane.rotation.x = - Math.PI / 2
    scene.add(plane)
    const clock = new ClockSystem()
    clock.position.set(0, 190, -50)
    clock.scale.set(1.4, 1.4, 1)
    scene.add(clock)

    // renderer
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)
}

window.addEventListener('resize', onWindowResize)
window.addEventListener('mousedown', onMouseDown, false)