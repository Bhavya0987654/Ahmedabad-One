package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.data.TransitData
import com.example.data.TransitStation
import com.example.ui.theme.BrandSecondary
import com.example.ui.theme.BrtsOrangeLine
import com.example.ui.theme.MetroBlueLine
import com.example.ui.theme.MetroRedLine

@Composable
fun TransitMapCanvas(
    selectedStation: TransitStation?,
    lineFilter: String,
    onStationClick: (TransitStation) -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "train_motion")
    val vehiclePhase by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 8000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "train_phase"
    )
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    val surfaceColor = MaterialTheme.colorScheme.surface
    val gridLineColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.15f)

    Box(
        modifier = modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(20.dp))
            .background(surfaceColor)
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
            .testTag("transit_map_canvas")
            .pointerInput(lineFilter) {
                detectTapGestures { offset ->
                    val width = size.width
                    val height = size.height

                    // Find nearest station within touch radius
                    val stationsToSearch = when (lineFilter) {
                        "Metro" -> TransitData.metroEastWestStations + TransitData.metroNorthSouthStations
                        "BRTS" -> TransitData.brtsStations
                        "Interchanges" -> TransitData.allStations.filter { it.isInterchange }
                        else -> TransitData.allStations
                    }

                    var closest: TransitStation? = null
                    var minDist = Float.MAX_VALUE

                    for (station in stationsToSearch) {
                        val sx = station.xRatio * width
                        val sy = station.yRatio * height
                        val dist = Math.hypot((sx - offset.x).toDouble(), (sy - offset.y).toDouble()).toFloat()
                        if (dist < 44.dp.toPx() && dist < minDist) {
                            minDist = dist
                            closest = station
                        }
                    }

                    if (closest != null) {
                        onStationClick(closest)
                    }
                }
            }
    ) {
        Canvas(modifier = Modifier.fillMaxSize().padding(12.dp)) {
            val canvasWidth = size.width
            val canvasHeight = size.height

            // 1. Draw subtle city transit grid lines
            val step = 48.dp.toPx()
            var gx = 0f
            while (gx < canvasWidth) {
                drawLine(
                    color = gridLineColor,
                    start = Offset(gx, 0f),
                    end = Offset(gx, canvasHeight),
                    strokeWidth = 1f
                )
                gx += step
            }
            var gy = 0f
            while (gy < canvasHeight) {
                drawLine(
                    color = gridLineColor,
                    start = Offset(0f, gy),
                    end = Offset(canvasWidth, gy),
                    strokeWidth = 1f
                )
                gy += step
            }

            // Sabarmati River curve flowing through Ahmedabad
            val riverPath = Path().apply {
                moveTo(canvasWidth * 0.48f, 0f)
                cubicTo(
                    canvasWidth * 0.50f, canvasHeight * 0.30f,
                    canvasWidth * 0.58f, canvasHeight * 0.60f,
                    canvasWidth * 0.52f, canvasHeight
                )
            }
            drawPath(
                path = riverPath,
                color = Color(0xFF1E88E5).copy(alpha = 0.15f),
                style = Stroke(width = 24.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
            )

            // 2. Metro East-West Line (Blue)
            if (lineFilter == "All" || lineFilter == "Metro" || lineFilter == "Interchanges") {
                val ewPath = Path()
                TransitData.metroEastWestStations.forEachIndexed { index, st ->
                    val x = st.xRatio * canvasWidth
                    val y = st.yRatio * canvasHeight
                    if (index == 0) ewPath.moveTo(x, y) else ewPath.lineTo(x, y)
                }
                // Under shadow
                drawPath(
                    path = ewPath,
                    color = MetroBlueLine.copy(alpha = 0.3f),
                    style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                )
                // Core track line
                drawPath(
                    path = ewPath,
                    color = MetroBlueLine,
                    style = Stroke(width = 6.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                )
            }

            // 3. Metro North-South Line (Red)
            if (lineFilter == "All" || lineFilter == "Metro" || lineFilter == "Interchanges") {
                val nsPath = Path()
                TransitData.metroNorthSouthStations.forEachIndexed { index, st ->
                    val x = st.xRatio * canvasWidth
                    val y = st.yRatio * canvasHeight
                    if (index == 0) nsPath.moveTo(x, y) else nsPath.lineTo(x, y)
                }
                drawPath(
                    path = nsPath,
                    color = MetroRedLine.copy(alpha = 0.3f),
                    style = Stroke(width = 12.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                )
                drawPath(
                    path = nsPath,
                    color = MetroRedLine,
                    style = Stroke(width = 6.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
                )
            }

            // 4. BRTS Janmarg Corridors (Orange dashed / solid)
            if (lineFilter == "All" || lineFilter == "BRTS" || lineFilter == "Interchanges") {
                val brtsPath = Path()
                TransitData.brtsStations.forEachIndexed { index, st ->
                    val x = st.xRatio * canvasWidth
                    val y = st.yRatio * canvasHeight
                    if (index == 0) brtsPath.moveTo(x, y) else brtsPath.lineTo(x, y)
                }
                drawPath(
                    path = brtsPath,
                    color = BrtsOrangeLine,
                    style = Stroke(
                        width = 4.dp.toPx(),
                        cap = StrokeCap.Round,
                        join = StrokeJoin.Round,
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(24f, 12f), 0f)
                    )
                )
            }

            // 5. Draw Station Nodes
            val visibleStations = when (lineFilter) {
                "Metro" -> TransitData.metroEastWestStations + TransitData.metroNorthSouthStations
                "BRTS" -> TransitData.brtsStations
                "Interchanges" -> TransitData.allStations.filter { it.isInterchange }
                else -> TransitData.allStations
            }

            for (station in visibleStations) {
                val sx = station.xRatio * canvasWidth
                val sy = station.yRatio * canvasHeight
                val isSelected = selectedStation?.id == station.id

                if (station.isInterchange) {
                    // Interchange station (Double halo ring)
                    drawCircle(
                        color = Color.White,
                        radius = 11.dp.toPx(),
                        center = Offset(sx, sy)
                    )
                    drawCircle(
                        color = Color(0xFF002366),
                        radius = 11.dp.toPx(),
                        center = Offset(sx, sy),
                        style = Stroke(width = 3.dp.toPx())
                    )
                    drawCircle(
                        color = BrandSecondary,
                        radius = 6.dp.toPx(),
                        center = Offset(sx, sy)
                    )
                } else {
                    // Standard station
                    drawCircle(
                        color = Color.White,
                        radius = 6.5.dp.toPx(),
                        center = Offset(sx, sy)
                    )
                    val lineColor = when (station.line) {
                        "East-West Line" -> MetroBlueLine
                        "North-South Line" -> MetroRedLine
                        "BRTS Janmarg" -> BrtsOrangeLine
                        else -> Color(0xFF1B8A44)
                    }
                    drawCircle(
                        color = lineColor,
                        radius = 6.5.dp.toPx(),
                        center = Offset(sx, sy),
                        style = Stroke(width = 2.5.dp.toPx())
                    )
                    drawCircle(
                        color = Color.White,
                        radius = 3.5.dp.toPx(),
                        center = Offset(sx, sy)
                    )
                }

                // Selected station highlight pulse
                if (isSelected) {
                    drawCircle(
                        color = BrandSecondary.copy(alpha = 0.35f),
                        radius = 18.dp.toPx() * pulseScale,
                        center = Offset(sx, sy)
                    )
                    drawCircle(
                        color = BrandSecondary,
                        radius = 12.dp.toPx(),
                        center = Offset(sx, sy),
                        style = Stroke(width = 2.5.dp.toPx())
                    )
                }
            }

            // 6. Animated Real-time Live Transit Vehicles
            // Vehicle on East-West Line
            val ewStations = TransitData.metroEastWestStations
            val ewProgress = (vehiclePhase * (ewStations.size - 1))
            val ewIndex = ewProgress.toInt().coerceIn(0, ewStations.size - 2)
            val ewFraction = ewProgress - ewIndex
            val ewStart = ewStations[ewIndex]
            val ewEnd = ewStations[ewIndex + 1]
            val ewVx = (ewStart.xRatio + (ewEnd.xRatio - ewStart.xRatio) * ewFraction) * canvasWidth
            val ewVy = (ewStart.yRatio + (ewEnd.yRatio - ewStart.yRatio) * ewFraction) * canvasHeight

            // Draw Metro EW Train beacon
            drawCircle(
                color = MetroBlueLine.copy(alpha = 0.4f),
                radius = 10.dp.toPx() * pulseScale,
                center = Offset(ewVx, ewVy)
            )
            drawCircle(
                color = Color(0xFF002366),
                radius = 7.dp.toPx(),
                center = Offset(ewVx, ewVy)
            )
            drawCircle(
                color = Color.White,
                radius = 3.dp.toPx(),
                center = Offset(ewVx, ewVy)
            )

            // Vehicle on North-South Line (Red)
            val nsStations = TransitData.metroNorthSouthStations
            val nsPhaseReversed = (1f - vehiclePhase)
            val nsProgress = (nsPhaseReversed * (nsStations.size - 1))
            val nsIndex = nsProgress.toInt().coerceIn(0, nsStations.size - 2)
            val nsFraction = nsProgress - nsIndex
            val nsStart = nsStations[nsIndex]
            val nsEnd = nsStations[nsIndex + 1]
            val nsVx = (nsStart.xRatio + (nsEnd.xRatio - nsStart.xRatio) * nsFraction) * canvasWidth
            val nsVy = (nsStart.yRatio + (nsEnd.yRatio - nsStart.yRatio) * nsFraction) * canvasHeight

            drawCircle(
                color = MetroRedLine.copy(alpha = 0.4f),
                radius = 10.dp.toPx() * pulseScale,
                center = Offset(nsVx, nsVy)
            )
            drawCircle(
                color = MetroRedLine,
                radius = 7.dp.toPx(),
                center = Offset(nsVx, nsVy)
            )
            drawCircle(
                color = Color.White,
                radius = 3.dp.toPx(),
                center = Offset(nsVx, nsVy)
            )
        }
    }
}
