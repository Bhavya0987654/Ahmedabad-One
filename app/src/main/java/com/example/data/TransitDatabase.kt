package com.example.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        TicketEntity::class,
        TransitCardEntity::class,
        WalletTransactionEntity::class,
        TravelRecordEntity::class,
        TransitAlertEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class TransitDatabase : RoomDatabase() {

    abstract fun transitDao(): TransitDao

    companion object {
        @Volatile
        private var INSTANCE: TransitDatabase? = null

        fun getDatabase(
            context: Context,
            scope: CoroutineScope = CoroutineScope(Dispatchers.IO)
        ): TransitDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    TransitDatabase::class.java,
                    "ahmedabad_one_transit_db"
                )
                    .addCallback(TransitDatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class TransitDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database.transitDao())
                    }
                }
            }

            suspend fun populateInitialData(dao: TransitDao) {
                // Initial Active QR Ticket (from Case Study Page 23)
                dao.insertTicket(
                    TicketEntity(
                        ticketNumber = "TKT-AHM-2026-9042",
                        originStation = "THALTEJ GAM",
                        destinationStation = "RABARI COLONY",
                        transitMode = "Metro",
                        passengerType = "Single",
                        passengerCount = 1,
                        totalFare = 25.0,
                        purchaseDate = "28 Apr, 2026 • 09:22",
                        validUntil = "28 Apr, 2026 • 12:22",
                        status = "Active",
                        platform = "02",
                        routeLine = "East-West Line (Platform 02)",
                        qrCodePayload = "AHM1-METRO-TKT-THL-RBR-VALID-2026"
                    )
                )

                // Past Ticket for History
                dao.insertTicket(
                    TicketEntity(
                        ticketNumber = "TKT-AHM-2026-8812",
                        originStation = "MOTERA STADIUM",
                        destinationStation = "OLD HIGH COURT",
                        transitMode = "Metro",
                        passengerType = "Single",
                        passengerCount = 1,
                        totalFare = 15.0,
                        purchaseDate = "26 Apr, 2026 • 17:40",
                        validUntil = "26 Apr, 2026 • 20:40",
                        status = "Completed",
                        platform = "01",
                        routeLine = "North-South Line",
                        qrCodePayload = "AHM1-METRO-TKT-MOT-OHC-USED"
                    )
                )

                // Active Metro Smart Pass (from Case Study Page 22)
                dao.insertCard(
                    TransitCardEntity(
                        cardNumber = "AM-8842-1092",
                        holderName = "Arjun Yah",
                        cardType = "Ahmedabad Metro",
                        mode = "Metro",
                        balance = 450.0,
                        expiryDate = "12/2028",
                        status = "Active",
                        passCategory = "Daily Travers Pass"
                    )
                )

                // Active BRTS i-Pass (Bus)
                dao.insertCard(
                    TransitCardEntity(
                        cardNumber = "IPASS-BRTS-4412",
                        holderName = "Arjun Yah",
                        cardType = "BRTS Janmarg Pass",
                        mode = "Bus",
                        balance = 280.0,
                        expiryDate = "08/2027",
                        status = "Active",
                        passCategory = "Student / Regular Pass"
                    )
                )

                // Initial Wallet Transactions (Total Balance ₹1,210.00 as shown on Page 24)
                val now = System.currentTimeMillis()
                dao.insertTransaction(
                    WalletTransactionEntity(
                        title = "Wallet Top-up via UPI",
                        subtitle = "Google Pay • Ref: UPI88912",
                        amount = 1000.0,
                        isCredit = true,
                        timestamp = now - 86400000L,
                        paymentMethod = "UPI"
                    )
                )
                dao.insertTransaction(
                    WalletTransactionEntity(
                        title = "AMTS City Bus Ride",
                        subtitle = "Lal Darwaja -> Iscon Cross Road",
                        amount = 7.0,
                        isCredit = false,
                        timestamp = now - 7200000L,
                        paymentMethod = "Ahmedabad One Wallet"
                    )
                )
                dao.insertTransaction(
                    WalletTransactionEntity(
                        title = "Metro QR Ticket",
                        subtitle = "Thaltej Gam -> Rabari Colony",
                        amount = 25.0,
                        isCredit = false,
                        timestamp = now - 3600000L,
                        paymentMethod = "Ahmedabad One Wallet"
                    )
                )
                dao.insertTransaction(
                    WalletTransactionEntity(
                        title = "BRTS Janmarg Ride",
                        subtitle = "RTO Circle -> Shivranjani",
                        amount = 15.0,
                        isCredit = false,
                        timestamp = now - 172800000L,
                        paymentMethod = "Ahmedabad One Wallet"
                    )
                )
                dao.insertTransaction(
                    WalletTransactionEntity(
                        title = "Cashback & Green Points Reward",
                        subtitle = "Metro Commute Bonus",
                        amount = 250.0,
                        isCredit = true,
                        timestamp = now - 250000000L,
                        paymentMethod = "Transit Loyalty"
                    )
                )

                // Initial Travel Records (for Daily Travers stats from Page 23: 36 trips, 439 km, ₹675 spent)
                val records = listOf(
                    TravelRecordEntity(origin = "Thaltej Gam", destination = "Rabari Colony", mode = "Metro", distanceKm = 17.5, farePaid = 25.0, dateStr = "28 Apr, 2026", co2SavedKg = 2.4),
                    TravelRecordEntity(origin = "Old High Court", destination = "Motera Stadium", mode = "Metro", distanceKm = 9.8, farePaid = 15.0, dateStr = "27 Apr, 2026", co2SavedKg = 1.6),
                    TravelRecordEntity(origin = "Shivranjani", destination = "RTO Circle", mode = "BRTS", distanceKm = 11.2, farePaid = 18.0, dateStr = "25 Apr, 2026", co2SavedKg = 1.8),
                    TravelRecordEntity(origin = "Kalupur Station", destination = "Lal Darwaja", mode = "AMTS", distanceKm = 4.2, farePaid = 8.0, dateStr = "24 Apr, 2026", co2SavedKg = 0.9)
                )
                records.forEach { dao.insertTravelRecord(it) }

                // Active Alerts (from Case Study Page 25)
                dao.insertAlert(
                    TransitAlertEntity(
                        routeCode = "ROUTE 003",
                        lineName = "METRO RED LINE",
                        title = "Active Alerts • Minor delay near APMC",
                        message = "Minor delay near APMC due to structural maintenance. Trains operating at 10-min headways.",
                        severity = "Warning",
                        timeAgo = "1 NEW"
                    )
                )
                dao.insertAlert(
                    TransitAlertEntity(
                        routeCode = "ROUTE 001",
                        lineName = "METRO BLUE LINE (EW)",
                        title = "On-Time Frequency",
                        message = "Trains running every 5 mins from Thaltej Gam during peak hours.",
                        severity = "Info",
                        timeAgo = "12m ago"
                    )
                )
                dao.insertAlert(
                    TransitAlertEntity(
                        routeCode = "BRTS 04",
                        lineName = "JANMARG CORRIDOR",
                        title = "Normal Operations",
                        message = "All RTO to Maninagar articulated buses running on schedule.",
                        severity = "Info",
                        timeAgo = "30m ago"
                    )
                )
            }
        }
    }
}
