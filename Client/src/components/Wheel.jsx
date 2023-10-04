import React, {useEffect, useState} from "react";

const WheelComponent = ({
                            segments,
                            segColors,
                            onFinished,
                            primaryColor,
                            size,
                            upDuration,
                            downDuration,
                            spin,
                        }) => {
    const [isFinished, setFinished] = useState(false);

    let currentSegment = "";
    let isStarted = false;
    let timerHandle = 0;
    let angleCurrent = 0;
    let angleDelta = 0;
    let canvasContext = null;
    let maxSpeed = Math.PI / `${segments.length}`;
    let spinStart = 0;
    let frames = 0;

    const upTime = segments.length * upDuration;
    const downTime = segments.length * downDuration;
    const centerX = 300;
    const centerY = 300;
    const timerDelay = segments.length;

    useEffect(() => {
        initCanvas();
        wheelDraw();
    }, [spin]);

    const wheelDraw = () => {
        clear();
        drawWheel();
        drawNeedle();
    };

    const initCanvas = () => {
        let canvas = document.getElementById("canvas");

        canvasContext = canvas.getContext("2d");

        if (spin) {
            isStarted = true;

            if (timerHandle === 0) {
                spinStart = new Date().getTime();
                maxSpeed = Math.PI / ((segments.length * 2) + Math.random());
                frames = 0;
                timerHandle = setInterval(onTimerTick, timerDelay);
            }
        }
    };

    const onTimerTick = () => {
        frames++;

        wheelDraw();

        const duration = new Date().getTime() - spinStart;

        let progress = 0;
        let finished = false;
        if (duration < upTime) {
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            progress = duration / downTime;
            if (progress >= 0.8) {
                angleDelta =
                    (maxSpeed / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            } else if (progress >= 0.98) {
                angleDelta =
                    (maxSpeed / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            } else
                angleDelta =
                    maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            if (progress >= 1) finished = true;
        }

        angleCurrent += angleDelta;

        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;

        if (finished) {
            setFinished(true);
            onFinished(currentSegment);
            clearInterval(timerHandle);

            timerHandle = 0;
            angleDelta = 0;
        }
    };

    const drawSegment = (key, lastAngle, angle) => {
        const ctx = canvasContext;
        const value = segments[key];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fillStyle = segColors[key];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = "white";
        ctx.font = "2.5rem bold";
        ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
        ctx.restore();
    };

    const drawWheel = () => {
        const ctx = canvasContext;
        let lastAngle = angleCurrent;
        const len = segments.length;
        const PI2 = Math.PI * 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor || "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (let i = 1; i <= len; i++) {
            const angle = PI2 * (i / len) + angleCurrent;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, PI2, false);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    };

    const drawNeedle = () => {
        const ctx = canvasContext;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#00003c";
        ctx.fillStyle = "#00003c";
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 280);
        ctx.lineTo(centerY - 15, centerY - 280);
        ctx.lineTo(centerX, centerY - 250);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY - 270, 2, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.lineWidth = 3;
        ctx.fill();

        const change = angleCurrent + Math.PI / 2;
        let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
        if (i < 0) i = i + segments.length;

        currentSegment = segments[i];
    };

    const clear = () =>
        canvasContext.clearRect(0, 0, 1000, 800);

    return (
        <div id="wheel">
            <canvas
                id={"canvas"}
                width={"600"}
                height={"600"}
                className={"wheel"}
                style={{
                    pointerEvents: isFinished ? "none" : "auto"
                }}
            />
        </div>
    );
};
export default WheelComponent;
