import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface SceneObject {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

interface Props {
  objects: SceneObject[];
  onSelect?: (id: string) => void;
}

export default function PlaceholderPlantScene({ objects, onSelect }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = 320;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const grid = new THREE.GridHelper(10, 10, 0x3b82f6, 0x1e293b);
    scene.add(grid);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 8, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    const meshes: THREE.Mesh[] = [];
    objects.forEach((obj) => {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const material = new THREE.MeshStandardMaterial({ color: obj.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(obj.x, obj.y + 0.4, obj.z);
      mesh.userData.id = obj.id;
      scene.add(mesh);
      meshes.push(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits[0]?.object.userData.id) onSelect?.(hits[0].object.userData.id as string);
    };
    renderer.domElement.addEventListener("click", onClick);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      renderer.domElement.removeEventListener("click", onClick);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [objects, onSelect]);

  return <div ref={mountRef} className="plant-scene-canvas" />;
}
