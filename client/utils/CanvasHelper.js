 function CanvasPainter (ctx) {

 
    function drawRectangle(x, y, width, height, fillColor, strokeColor, radius) {
        
        if (fillColor !== false) {
            ctx.fillStyle = fillColor;
        }
        if (strokeColor !== false ) {
            ctx.strokeStyle = strokeColor;
        }
        if (radius) {
            ctx.beginPath();
            ctx.translate(x, y);

            // Move to the center of the top horizontal line
            ctx.moveTo(width / 2,0);
            
            // Draw the rounded corners. The connecting lines in between them are drawn automatically
            ctx.arcTo(width, 0 , width, height, Math.min(height / 2, radius));
            ctx.arcTo(width, height, 0, height, Math.min(width / 2, radius));
            ctx.arcTo(0, height, 0, 0, Math.min(height / 2, radius));
            ctx.arcTo(0, 0, radius, 0, Math.min(width / 2, radius));

            // Draw a line back to the start coordinates
            ctx.lineTo(width / 2,0);
            ctx.translate(-x, -y);
            if (fillColor) {
                ctx.fill();
            }
            if (strokeColor) {
                ctx.stroke();
            }
        } else {
            if (fillColor !== false) {
                ctx.fillRect(x, y, width, height);
            } else {
                ctx.strokeRect(x, y, width, height);
            }
        }
    }

    return {
        drawRectangle,
    }

}

export default CanvasPainter;