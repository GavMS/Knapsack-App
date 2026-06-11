// Scene (wizard) navigation: only one scene is visible at a time.

const SCENES = [
    { id: 'scene-setup',     title: 'Problem Setup' },
    { id: 'scene-overview',  title: 'Problem Overview' },
    { id: 'scene-execution', title: 'Algorithm Execution' },
    { id: 'scene-tree',      title: 'Tree Visualization' },
    { id: 'scene-inspector', title: 'Node Inspector' },
    { id: 'scene-result',    title: 'Final Result' }
];

let currentSceneIndex = 0;

function goToScene(index) {
    if (index < 0 || index >= SCENES.length) return;

    // Scenes beyond Problem Setup require a valid problem (n >= 8)
    if (index > 0 && items.length < 8) {
        alertPanel.classList.add('active');
        alertText.textContent = `Jumlah barang minimal harus 8 untuk melanjutkan (Saat ini: ${items.length} barang). Silakan tambah barang atau pilih preset.`;
        goToScene(0);
        return;
    }

    currentSceneIndex = index;

    SCENES.forEach((scene, i) => {
        const el = document.getElementById(scene.id);
        if (el) el.classList.toggle('active', i === index);
    });

    // Update navigation bar
    const stepIndicator = document.getElementById('sceneStepIndicator');
    const backBtn = document.getElementById('sceneBackBtn');
    const nextBtn = document.getElementById('sceneNextBtn');

    stepIndicator.textContent = `Langkah ${index + 1} dari ${SCENES.length}: ${SCENES[index].title}`;
    backBtn.disabled = index === 0;
    backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.disabled = index === SCENES.length - 1;
    nextBtn.style.visibility = index === SCENES.length - 1 ? 'hidden' : 'visible';

    window.scrollTo(0, 0);
}

function nextScene() {
    goToScene(currentSceneIndex + 1);
}

function prevScene() {
    goToScene(currentSceneIndex - 1);
}
