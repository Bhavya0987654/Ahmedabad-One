package com.example.data

data class TransitStation(
    val id: String,
    val name: String,
    val line: String, // "East-West Line", "North-South Line", "BRTS Janmarg", "AMTS"
    val isInterchange: Boolean = false,
    val interchangeWith: List<String> = emptyList(),
    val platform: String = "01",
    val xRatio: Float = 0.5f,
    val yRatio: Float = 0.5f
)

data class LiveTransitVehicle(
    val id: String,
    val routeCode: String,
    val lineName: String,
    val mode: String, // "Metro", "BRTS", "AMTS"
    val nextStation: String,
    val currentSpeedKmH: Int,
    val status: String, // "ON TIME", "SLIGHT DELAY", "2 MIN EARLY"
    val onTimePercentage: Int,
    val progressRatio: Float // 0.0 to 1.0 along route
)

object TransitData {

    // Ahmedabad Metro East-West Line (Thaltej Gam -> Vastral Gam)
    val metroEastWestStations = listOf(
        TransitStation("ew_1", "Thaltej Gam", "East-West Line", platform = "02", xRatio = 0.15f, yRatio = 0.38f),
        TransitStation("ew_2", "Thaltej", "East-West Line", platform = "01", xRatio = 0.22f, yRatio = 0.40f),
        TransitStation("ew_3", "Doordarshan Kendra", "East-West Line", platform = "01", xRatio = 0.29f, yRatio = 0.42f),
        TransitStation("ew_4", "Gurukul Road", "East-West Line", platform = "02", xRatio = 0.36f, yRatio = 0.44f),
        TransitStation("ew_5", "Gujarat University", "East-West Line", platform = "01", xRatio = 0.42f, yRatio = 0.46f),
        TransitStation("ew_6", "Commerce Six Road", "East-West Line", platform = "01", xRatio = 0.47f, yRatio = 0.48f),
        TransitStation("ew_7", "SP Stadium", "East-West Line", platform = "02", xRatio = 0.51f, yRatio = 0.50f),
        TransitStation(
            "ew_8", "Old High Court", "East-West Line",
            isInterchange = true,
            interchangeWith = listOf("North-South Line", "BRTS Janmarg"),
            platform = "02",
            xRatio = 0.55f,
            yRatio = 0.52f
        ),
        TransitStation("ew_9", "Shahpur", "East-West Line", platform = "01", xRatio = 0.60f, yRatio = 0.53f),
        TransitStation("ew_10", "Gheekanta", "East-West Line", platform = "01", xRatio = 0.65f, yRatio = 0.54f),
        TransitStation("ew_11", "Kalupur Metro Station", "East-West Line", isInterchange = true, interchangeWith = listOf("Indian Railways", "AMTS"), platform = "02", xRatio = 0.70f, yRatio = 0.55f),
        TransitStation("ew_12", "Kankariya East", "East-West Line", platform = "01", xRatio = 0.75f, yRatio = 0.56f),
        TransitStation("ew_13", "Apparel Park", "East-West Line", platform = "02", xRatio = 0.80f, yRatio = 0.57f),
        TransitStation("ew_14", "Amraiwadi", "East-West Line", platform = "01", xRatio = 0.84f, yRatio = 0.58f),
        TransitStation("ew_15", "Rabari Colony", "East-West Line", isInterchange = true, interchangeWith = listOf("BRTS Janmarg"), platform = "02", xRatio = 0.88f, yRatio = 0.59f),
        TransitStation("ew_16", "Vastral", "East-West Line", platform = "01", xRatio = 0.92f, yRatio = 0.60f),
        TransitStation("ew_17", "Nirant Cross Road", "East-West Line", platform = "01", xRatio = 0.95f, yRatio = 0.61f),
        TransitStation("ew_18", "Vastral Gam", "East-West Line", platform = "02", xRatio = 0.98f, yRatio = 0.62f)
    )

    // Ahmedabad Metro North-South Line (Motera Stadium -> APMC)
    val metroNorthSouthStations = listOf(
        TransitStation("ns_1", "Motera Stadium", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.12f),
        TransitStation("ns_2", "Sabarmati", "North-South Line", isInterchange = true, interchangeWith = listOf("Bullet Train HSR", "Indian Railways"), platform = "02", xRatio = 0.55f, yRatio = 0.20f),
        TransitStation("ns_3", "AEC", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.26f),
        TransitStation("ns_4", "Ranip", "North-South Line", isInterchange = true, interchangeWith = listOf("GSRTC Central Bus"), platform = "01", xRatio = 0.55f, yRatio = 0.32f),
        TransitStation("ns_5", "Vadaj", "North-South Line", platform = "02", xRatio = 0.55f, yRatio = 0.38f),
        TransitStation("ns_6", "Vijaynagar", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.43f),
        TransitStation("ns_7", "Usmanpura", "North-South Line", platform = "02", xRatio = 0.55f, yRatio = 0.48f),
        TransitStation(
            "ns_8", "Old High Court", "North-South Line",
            isInterchange = true,
            interchangeWith = listOf("East-West Line", "BRTS Janmarg"),
            platform = "02",
            xRatio = 0.55f,
            yRatio = 0.52f
        ),
        TransitStation("ns_9", "Gandhigram", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.58f),
        TransitStation("ns_10", "Paldi", "North-South Line", isInterchange = true, interchangeWith = listOf("AMTS"), platform = "01", xRatio = 0.55f, yRatio = 0.64f),
        TransitStation("ns_11", "Shreyas", "North-South Line", platform = "02", xRatio = 0.55f, yRatio = 0.70f),
        TransitStation("ns_12", "Rajiv Nagar", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.76f),
        TransitStation("ns_13", "Jivraj Park", "North-South Line", platform = "02", xRatio = 0.55f, yRatio = 0.82f),
        TransitStation("ns_14", "APMC", "North-South Line", platform = "01", xRatio = 0.55f, yRatio = 0.89f)
    )

    // BRTS Janmarg Main Stations
    val brtsStations = listOf(
        TransitStation("brts_1", "RTO Circle", "BRTS Janmarg", platform = "Bay 1", xRatio = 0.45f, yRatio = 0.28f),
        TransitStation("brts_2", "Memnagar", "BRTS Janmarg", platform = "Bay 2", xRatio = 0.38f, yRatio = 0.36f),
        TransitStation("brts_3", "Shivranjani", "BRTS Janmarg", platform = "Bay 1", xRatio = 0.32f, yRatio = 0.58f),
        TransitStation("brts_4", "ISKCON Cross Road", "BRTS Janmarg", platform = "Bay 3", xRatio = 0.20f, yRatio = 0.58f),
        TransitStation("brts_5", "Bopal Approach", "BRTS Janmarg", platform = "Bay 1", xRatio = 0.10f, yRatio = 0.58f),
        TransitStation("brts_6", "Anjali (Vasna)", "BRTS Janmarg", platform = "Bay 2", xRatio = 0.48f, yRatio = 0.72f),
        TransitStation("brts_7", "Geeta Mandir", "BRTS Janmarg", platform = "Bay 1", xRatio = 0.64f, yRatio = 0.64f),
        TransitStation("brts_8", "Maninagar", "BRTS Janmarg", platform = "Bay 4", xRatio = 0.72f, yRatio = 0.74f),
        TransitStation("brts_9", "Bapu Nagar", "BRTS Janmarg", platform = "Bay 2", xRatio = 0.78f, yRatio = 0.42f),
        TransitStation("brts_10", "Rabari Colony", "BRTS Janmarg", isInterchange = true, platform = "Bay 1", xRatio = 0.88f, yRatio = 0.59f),
        TransitStation("brts_11", "Odhav Gam", "BRTS Janmarg", platform = "Bay 2", xRatio = 0.94f, yRatio = 0.50f),
        TransitStation("brts_12", "Nikol, Naroda", "BRTS Janmarg", platform = "Bay 1", xRatio = 0.86f, yRatio = 0.30f),
        TransitStation("brts_13", "Naroda Gam", "BRTS Janmarg", platform = "Bay 3", xRatio = 0.90f, yRatio = 0.22f)
    )

    // AMTS Major Stations
    val amtsStations = listOf(
        TransitStation("amts_1", "Lal Darwaja Terminus", "AMTS", platform = "Gate A", xRatio = 0.58f, yRatio = 0.54f),
        TransitStation("amts_2", "Kalupur Station", "AMTS", platform = "Gate C", xRatio = 0.70f, yRatio = 0.55f),
        TransitStation("amts_3", "Vadaj Terminus", "AMTS", platform = "Gate 1", xRatio = 0.54f, yRatio = 0.38f),
        TransitStation("amts_4", "Nehrunagar Circle", "AMTS", platform = "Gate 2", xRatio = 0.40f, yRatio = 0.56f),
        TransitStation("amts_5", "Ellis Bridge", "AMTS", platform = "Gate 1", xRatio = 0.52f, yRatio = 0.54f),
        TransitStation("amts_6", "Civil Hospital", "AMTS", platform = "Gate 3", xRatio = 0.68f, yRatio = 0.35f)
    )

    val allStations: List<TransitStation> by lazy {
        (metroEastWestStations + metroNorthSouthStations + brtsStations + amtsStations)
            .distinctBy { it.name }
    }

    val liveVehicles = listOf(
        LiveTransitVehicle("M-422", "EW-101", "East-West Line", "Metro", "Rabari Colony", 54, "ON TIME", 94, 0.72f),
        LiveTransitVehicle("M-308", "NS-204", "North-South Line", "Metro", "Old High Court", 48, "ON TIME", 96, 0.45f),
        LiveTransitVehicle("M-422T", "NS-422", "North-South Line", "Metro", "Thaltej", 52, "92% ON TIME", 92, 0.30f),
        LiveTransitVehicle("B-14", "BRTS 04", "RTO -> Maninagar", "BRTS", "Shivranjani", 36, "ON TIME", 88, 0.50f),
        LiveTransitVehicle("A-88", "AMTS 138", "Lal Darwaja -> Bopal", "AMTS", "Nehrunagar", 28, "SLIGHT DELAY", 82, 0.65f)
    )

    fun calculateFare(origin: String, destination: String, mode: String, isFamily: Boolean, count: Int): Double {
        if (origin.isBlank() || destination.isBlank() || origin == destination) {
            return if (isFamily) 30.0 else 10.0
        }
        val origIdx = allStations.indexOfFirst { it.name.equals(origin, ignoreCase = true) }
        val destIdx = allStations.indexOfFirst { it.name.equals(destination, ignoreCase = true) }
        val hops = if (origIdx != -1 && destIdx != -1) Math.abs(destIdx - origIdx).coerceAtLeast(1) else 4

        val baseFare = when (mode) {
            "Metro" -> 5.0 + (hops * 2.0).coerceAtMost(25.0)
            "BRTS" -> 4.0 + (hops * 1.5).coerceAtMost(20.0)
            "AMTS" -> 3.0 + (hops * 1.2).coerceAtMost(18.0)
            else -> 10.0 + (hops * 2.5).coerceAtMost(35.0) // Combo 3-in-1
        }
        val discounted = if (mode == "Combo") baseFare * 0.90 else baseFare
        val multiplier = if (isFamily) count.coerceAtLeast(2) else 1
        return Math.round(discounted * multiplier).toDouble()
    }

    fun calculateDistanceAndTime(origin: String, destination: String): Pair<Double, Int> {
        val origIdx = allStations.indexOfFirst { it.name.equals(origin, ignoreCase = true) }
        val destIdx = allStations.indexOfFirst { it.name.equals(destination, ignoreCase = true) }
        val hops = if (origIdx != -1 && destIdx != -1) Math.abs(destIdx - origIdx).coerceAtLeast(1) else 4
        val distance = Math.round(hops * 1.6 * 10.0) / 10.0
        val timeMinutes = (hops * 2.5 + 4).toInt()
        return Pair(distance, timeMinutes)
    }

    val sampleFaqs = listOf(
        Pair("How does Ahmedabad One unify Metro and Bus passes?", "Ahmedabad One integrates both the Gujarat Metro Smart Pass and AMTS/BRTS i-Pass under a single digital barcode/QR, allowing seamless gate scanning and conductor validation across all 3 services."),
        Pair("Can I buy group / family tickets?", "Yes! Use the 'Family' toggle on the booking card to select up to 6 passengers on a single QR code for fast entry."),
        Pair("Does offline ticket viewing work?", "Yes, all booked tickets and active smart cards are cached locally in your device and can be scanned even when offline or in underground metro stations without mobile network."),
        Pair("Where is the main interchange station?", "Old High Court Station serves as the primary cross-platform interchange connecting the East-West line (Thaltej Gam - Vastral Gam) and the North-South line (Motera - APMC)."),
        Pair("How do I get the 10% Combo discount?", "Choosing the 3-in-1 Combo ticket or pass automatically applies an instant 10% discount on transit fares across Metro, BRTS, and AMTS.")
    )

    val dosAndDonts = listOf(
        Pair("Do", "Keep your QR ticket or Smart Card ready on your phone screen before approaching the AFC gate turnstile."),
        Pair("Do", "Offer designated priority seating to senior citizens, pregnant women, and differently-abled commuters."),
        Pair("Do", "Press the alarm or contact station helpline 1800-233-0000 in case of emergencies."),
        Pair("Don't", "Do not carry prohibited items including inflammable materials, open food containers, or unauthorized pets."),
        Pair("Don't", "Never force open automated train or bus sliding doors while in transit.")
    )
}
