package com.example.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface TransitDao {

    // Tickets
    @Query("SELECT * FROM tickets ORDER BY id DESC")
    fun getAllTickets(): Flow<List<TicketEntity>>

    @Query("SELECT * FROM tickets WHERE status = 'Active' ORDER BY id DESC LIMIT 1")
    fun getActiveTicket(): Flow<TicketEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTicket(ticket: TicketEntity): Long

    @Update
    suspend fun updateTicket(ticket: TicketEntity)

    // Cards / Passes
    @Query("SELECT * FROM transit_cards ORDER BY id ASC")
    fun getAllCards(): Flow<List<TransitCardEntity>>

    @Query("SELECT * FROM transit_cards WHERE mode = :mode LIMIT 1")
    fun getCardByMode(mode: String): Flow<TransitCardEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCard(card: TransitCardEntity): Long

    @Update
    suspend fun updateCard(card: TransitCardEntity)

    // Wallet Transactions
    @Query("SELECT * FROM wallet_transactions ORDER BY timestamp DESC")
    fun getAllTransactions(): Flow<List<WalletTransactionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: WalletTransactionEntity): Long

    // Travel Records (Daily Travers)
    @Query("SELECT * FROM travel_records ORDER BY id DESC")
    fun getAllTravelRecords(): Flow<List<TravelRecordEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTravelRecord(record: TravelRecordEntity): Long

    // Alerts
    @Query("SELECT * FROM transit_alerts ORDER BY id ASC")
    fun getAllAlerts(): Flow<List<TransitAlertEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAlert(alert: TransitAlertEntity): Long
}
