using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class CustomerController : ControllerBase
    {
        [HttpGet("loyalty/{passengerId}")]
        public IActionResult GetLoyalty(int passengerId)
        {
            // Logic: Fetch points and tier from DB
            return Ok(new 
            {
                PassengerID = passengerId,
                Points = 1250,
                Tier = "GOLD",
                NextTierProgress = 75,
                Benefits = new string[] { "VIP Priority Dispatch", "10% Subscription Discount" }
            });
        }

        [HttpPost("subscription/purchase")]
        public IActionResult PurchaseSubscription([FromBody] SubscriptionRequest req)
        {
            // Logic: Create subscription record and bill customer
            return Ok(new 
            {
                Status = "Subscription Activated",
                Plan = req.PlanName,
                Expiry = DateTime.Now.AddDays(30),
                TransactionID = "TXN_" + Guid.NewGuid().ToString().Substring(0, 8)
            });
        }

        [HttpPost("loyalty/add-points")]
        public IActionResult AddPoints(int passengerId, int amount)
        {
            // Logic: Update ledger
            return Ok(new { UpdatedBalance = 1250 + amount });
        }
    }

    public class SubscriptionRequest
    {
        public int PassengerID { get; set; }
        public string PlanName { get; set; } // "MONTHLY_COMMUTE", "LIMO_CIRCLE"
        public string PaymentMethod { get; set; }
    }
}
