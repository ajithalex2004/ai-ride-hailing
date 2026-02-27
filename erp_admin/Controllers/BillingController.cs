using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class BillingController : ControllerBase
    {
        // Mock Data for demonstration
        private static List<dynamic> _budgets = new List<dynamic>
        {
            new { Id = 1, Dept = "Engineering", Allocated = 50000, Spent = 12000 },
            new { Id = 2, Dept = "Sales", Allocated = 30000, Spent = 8500 }
        };

        [HttpGet("budgets")]
        public IActionResult GetBudgets() => Ok(_budgets);

        [HttpPost("track-ride")]
        public IActionResult TrackRideCharge([FromBody] RideChargeRequest req)
        {
            // Logic: Deduct from cost center budget
            return Ok(new { status = "Charge Allocated", cost_center = req.CostCenterId, amount = req.Amount });
        }

        [HttpPost("calculate-penalty")]
        public IActionResult CalculateSLAPenalty([FromBody] SLAReport report)
        {
            if (report.DelayMinutes > 15) // Breach threshold
            {
                var penalty = report.BaseFare * 0.20; // 20% Penalty
                return Ok(new { 
                    status = "BREACHED", 
                    penalty_amount = penalty, 
                    reason = "Pickup Delay > 15m" 
                });
            }
            return Ok(new { status = "COMPLIANT" });
        }
    }

    public class RideChargeRequest
    {
        public int CostCenterId { get; set; }
        public double Amount { get; set; }
    }

    public class SLAReport
    {
        public int DelayMinutes { get; set; }
        public double BaseFare { get; set; }
    }
}
