export default function animateValueChange(
    start: number,
    end: number,
    duration: number,
    onUpdate: (current: number) => void
) {
    start = Math.ceil(start);
    end = Math.ceil(end);

    const difference = end - start;
    if (difference === 0) {
        onUpdate(end);
        return;
    }

    const steps = Math.min(Math.abs(difference), 100); // не более 100 шагов
    const stepTime = duration / steps;
    const stepSize = difference / steps;

    let current = start;
    let currentStep = 0;

    const interval = setInterval(() => {
        currentStep++;
        current += stepSize;

        // Последний шаг — принудительно устанавливаем конечное значение
        if (currentStep >= steps) {
            clearInterval(interval);
            onUpdate(end);
        } else {
            onUpdate(Math.round(current));
        }
    }, stepTime);
}
