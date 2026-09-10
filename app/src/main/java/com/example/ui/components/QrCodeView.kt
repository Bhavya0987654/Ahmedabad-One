package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.ui.theme.BrandPrimary
import com.example.ui.theme.BrandSecondary
import kotlin.random.Random

@Composable
fun TransitQrCode(
    payload: String,
    modifier: Modifier = Modifier,
    size: Dp = 180.dp,
    showScanLine: Boolean = true
) {
    val infiniteTransition = rememberInfiniteTransition(label = "scanner")
    val scanProgress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2400, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "scan_progress"
    )

    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .padding(12.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val canvasWidth = this.size.width
            val canvasHeight = this.size.height
            val gridSize = 19
            val cellSize = canvasWidth / gridSize

            // Draw QR Finder Patterns (Top-Left, Top-Right, Bottom-Left)
            fun drawFinderPattern(col: Int, row: Int) {
                val left = col * cellSize
                val top = row * cellSize
                val outerSize = cellSize * 5

                // Outer square
                drawRoundRect(
                    color = Color(0xFF002366),
                    topLeft = Offset(left, top),
                    size = Size(outerSize, outerSize),
                    cornerRadius = CornerRadius(cellSize, cellSize),
                    style = Stroke(width = cellSize * 0.9f)
                )

                // Inner filled square
                val innerOffset = cellSize * 1.5f
                val innerSize = cellSize * 2f
                drawRoundRect(
                    color = Color(0xFF002366),
                    topLeft = Offset(left + innerOffset, top + innerOffset),
                    size = Size(innerSize, innerSize),
                    cornerRadius = CornerRadius(cellSize * 0.5f, cellSize * 0.5f)
                )
            }

            drawFinderPattern(1, 1)
            drawFinderPattern(gridSize - 6, 1)
            drawFinderPattern(1, gridSize - 6)

            // Seed deterministic pseudo-random QR modules from payload hash
            val seed = payload.hashCode().toLong()
            val random = Random(seed)

            for (r in 0 until gridSize) {
                for (c in 0 until gridSize) {
                    // Skip finder pattern zones
                    val inTopLeft = r < 7 && c < 7
                    val inTopRight = r < 7 && c >= gridSize - 7
                    val inBottomLeft = r >= gridSize - 7 && c < 7
                    val isCenterMonogram = r in 8..10 && c in 8..10

                    if (!inTopLeft && !inTopRight && !inBottomLeft && !isCenterMonogram) {
                        if (random.nextFloat() > 0.45f) {
                            drawRoundRect(
                                color = if (random.nextFloat() > 0.88f) Color(0xFFFC8712) else Color(0xFF1E2430),
                                topLeft = Offset(c * cellSize + cellSize * 0.1f, r * cellSize + cellSize * 0.1f),
                                size = Size(cellSize * 0.8f, cellSize * 0.8f),
                                cornerRadius = CornerRadius(cellSize * 0.2f, cellSize * 0.2f)
                            )
                        }
                    }
                }
            }

            // Center transit emblem badge
            val badgeSize = cellSize * 3
            val badgeX = (canvasWidth - badgeSize) / 2
            val badgeY = (canvasHeight - badgeSize) / 2
            drawRoundRect(
                color = Color(0xFF002366),
                topLeft = Offset(badgeX, badgeY),
                size = Size(badgeSize, badgeSize),
                cornerRadius = CornerRadius(cellSize * 0.6f, cellSize * 0.6f)
            )
            drawCircle(
                color = Color(0xFFFC8712),
                radius = cellSize * 0.7f,
                center = Offset(canvasWidth / 2, canvasHeight / 2)
            )

            // Scanning laser line
            if (showScanLine) {
                val lineY = scanProgress * canvasHeight
                drawLine(
                    color = Color(0xFFFC8712).copy(alpha = 0.85f),
                    start = Offset(0f, lineY),
                    end = Offset(canvasWidth, lineY),
                    strokeWidth = 3f
                )
            }
        }
    }
}

@Composable
fun TransitBarcode(
    code: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .width(220.dp)
            .height(55.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(Color.White)
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height
            val bars = 36
            val barWidth = width / bars
            val random = Random(code.hashCode().toLong())

            for (i in 0 until bars) {
                val isThick = random.nextBoolean()
                val isDrawn = random.nextFloat() > 0.25f
                if (isDrawn) {
                    val w = if (isThick) barWidth * 0.8f else barWidth * 0.4f
                    drawRect(
                        color = Color(0xFF1E2430),
                        topLeft = Offset(i * barWidth, 0f),
                        size = Size(w, height)
                    )
                }
            }
        }
    }
}
