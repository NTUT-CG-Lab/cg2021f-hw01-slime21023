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
    Raycaster,
    BoxGeometry,
    MathUtils
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

class ClockNumber extends Object3D {
    constructor() {
        super()
        const numbers = [
            { number: '12' },
            { number: '1' },
            { number: '2' },
            { number: '3' },
            { number: '4' },
            { number: '5' },
            { number: '6' },
            { number: '7' },
            { number: '8' },
            { number: '9' },
            { number: '10' },
            { number: '11' },
        ]

        const numFirstPosition = new Vector3(0, 65, 2)
        const numAxis = new Vector3(0, 0, 1)
        const createNumberPosition = (deg) => new Vector3().copy(numFirstPosition).applyAxisAngle(numAxis, Math.PI / 6 * deg)
        numbers.forEach(({ number }, index) => {
            const textMat = new MeshPhongMaterial({ color: 0xffff00, flatShading: true })
            const textGeo = new TextGeometry(number, {
                font,
                size: 10,
                height: 10,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true
            })
            textGeo.computeBoundingBox()
            textGeo.computeVertexNormals()
            const textMesh = new Mesh(textGeo, textMat)
            textMesh.position.copy(createNumberPosition(-index))
            this.add(textMesh)
        })
    }
}

class ClockSystem extends Object3D {
    constructor() {
        super()
        const firstPosition = new Vector3(0, 90, 1)
        const axis = new Vector3(0, 0, 1)
        const createPosition = (deg) => new Vector3().copy(firstPosition).applyAxisAngle(axis, Math.PI / 6 * deg)
        const items = [
            { text: '子', link: 'https://ntut-cg-lab.github.io/cg2021f-hw01-slime21023/', position: firstPosition },
            { text: '丑', link: 'https://ntut-cg-lab.github.io/cg2021f-hw02-slime21023/', position: createPosition(11) },
            { text: '寅', link: 'https://ntut-cg-lab.github.io/cg2021f-hw03-slime21023/', position: createPosition(10) },
            { text: '卯', link: 'https://ntut-cg-lab.github.io/cg2021f-hw04-slime21023/', position: createPosition(9) },
            { text: '辰', link: 'https://ntut-cg-lab.github.io/cg2021f-hw05-slime21023/', position: createPosition(8) },
            { text: '巳', link: 'https://ntut-cg-lab.github.io/cg2021f-hw06-slime21023/', position: createPosition(7) },
            { text: '午', link: 'https://ntut-cg-lab.github.io/cg2021f-hw07-slime21023/', position: createPosition(6) },
            { text: '未', link: 'https://ntut-cg-lab.github.io/cg2021f-hw08-slime21023/', position: createPosition(5) },
            { text: '申', link: 'https://ntut-cg-lab.github.io/cg2021f-hw09-slime21023/', position: createPosition(4) },
            { text: '酉', link: 'https://ntut-cg-lab.github.io/cg2021f-hw10-slime21023/', position: createPosition(3) },
            { text: '戌', link: 'https://ntut-cg-lab.github.io/cg2021f-hw11-slime21023/', position: createPosition(2) },
            { text: '亥', link: 'https://ntut-cg-lab.github.io/cg2021f-hw12-slime21023/', position: createPosition(1) }
        ]

        const createClockItem = ({ text, link, position }) => new ClockItem(text, link, position)
        items.forEach(item => this.add(createClockItem(item)))
        const circleGeo = new CircleGeometry(100, 32)
        const circleMat = new MeshBasicMaterial({ color: 0xff0000 })
        const circleMash = new Mesh(circleGeo, circleMat)
        circleMash.position.set(0, 0, 0)
        this.add(circleMash)

        const clockNum = new ClockNumber()
        clockNum.position.set(0, 0, 0)
        this.add(clockNum)

        // ClockTime
        const hourhandGeo = new BoxGeometry(3, 1.0, 200)
        const hourhandMater = new MeshBasicMaterial({ color: 0x00ff00 })
        const hourhandMesh = new Mesh(hourhandGeo, hourhandMater)
        hourhandMesh.geometry.computeBoundingBox()
        const hourhandCenter = new Vector3()
        hourhandMesh.geometry.boundingBox.getCenter(hourhandCenter)
        hourhandMesh.localToWorld(hourhandCenter)
        this.add(hourhandMesh)
        this.hour = hourhandMesh

        const minutehandGeo = new BoxGeometry(2, 0.5, 300)
        const minutehandMater = new MeshBasicMaterial({ color: 0x00ffff })
        const minutehandMesh = new Mesh(minutehandGeo, minutehandMater)
        minutehandMesh.geometry.computeBoundingBox()
        const minutehandCenter = new Vector3()
        minutehandMesh.geometry.boundingBox.getCenter(minutehandCenter)
        minutehandMesh.localToWorld(minutehandCenter)
        this.add(minutehandMesh)
        this.minute = minutehandMesh

        const secondhandGeo = new BoxGeometry(0.5, 0.8, 350)
        const secondhandMater = new MeshBasicMaterial({ color: 0x0fffff })
        const secondhandMesh = new Mesh(secondhandGeo, secondhandMater)
        secondhandMesh.geometry.computeBoundingBox()
        const secondhandCenter = new Vector3()
        secondhandMesh.geometry.boundingBox.getCenter(minutehandCenter)
        secondhandMesh.localToWorld(secondhandCenter)
        this.add(secondhandMesh)
        this.second = secondhandMesh
        // this.updateHands()
    }

    updateHands() {
        // let date = new Date()
        // const second = date.getSeconds()
        // const minute = date.getMinutes() + second / 60
        // const hour = date.getHours() + minute / 60

        // console.log(MathUtils.degToRad(second * 6))
        const axis = new Vector3(0, 0, 1)
        this.second.rotateOnAxis(axis, Math.PI / 6)
        // this.minute.rotateY(- MathUtils.degToRad(6 * minute))
        // this.hour.rotateY(- MathUtils.degToRad(6 * hour))
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
    // windowHalfX = window.innerWidth / 2
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
    // scene.clockSystem.updateHands()
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
    scene.clockSystem = clock

    // renderer
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)
}

window.addEventListener('resize', onWindowResize)
window.addEventListener('mousedown', onMouseDown, false)