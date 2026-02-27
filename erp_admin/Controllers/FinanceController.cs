using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class FinanceController : ControllerBase
    {
        [HttpPost("calculate-split")]
        public IActionResult CalculateRevenueSplit([FromBody] SplitRequest req)
        {
            // Logic: Calculate Platform vs Fleet vs Driver split
            double platformCut = req.TotalAmount * 0.20; // 20% Base
            
            // Performance Bonus (Simulated)
            double performanceBonus = req.DriverRating > 4.8 ? req.TotalAmount * 0.05 : 0;
            
            double finalDriverAmount = (req.TotalAmount - platformCut) + performanceBonus;

            return Ok(new 
            { 
                Total = req.TotalAmount,
                PlatformTake = platformCut - performanceBonus,
                DriverNet = finalDriverAmount,
                Currency = req.CurrencyCode
            });
        }

        [HttpGet("exchange-rates")]
        public IActionResult GetRates() => Ok(new Dictionary<string, double>
        {
            { "AED", 1.0 },
            { "USD", 0.27 },
            { "SAR", 1.02 },
            { "EUR", 0.25 }
        });

        [HttpPost("update-commission")]
        public IActionResult SetCommission([FromBody] dynamic config)
        {
            // Logic: Update Tier-based commission rules
            return Ok(new { status = "Commission Configuration Updated", timestamp = DateTime.Now });
        }
    }

    public class SplitRequest
    {
        public double TotalAmount { get; set; }
        public double DriverRating { get; set; }
        public string CurrencyCode { get; set; } = "AED";
    }
}
