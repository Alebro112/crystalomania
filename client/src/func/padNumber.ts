export default function padNumber(num: number, digits: number): string {
    const intPart = Math.floor(Math.abs(num)); // убираем дробную часть и минус
    return intPart.toString().padStart(digits, '0');
}