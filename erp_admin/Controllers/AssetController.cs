using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class AssetController : ControllerBase
    {
        [HttpPost("procurement")]
        public IActionResult LogProcurement([FromBody] ProcurementRequest req)
        {
            // Logic: Register asset in financial ledgers
            return Ok(new 
            { 
                AssetId = Guid.NewGuid(),
                Status = "Capitalized",
                PurchasePrice = req.Price,
                RegistrationDate = DateTime.Now
            });
        }

        [HttpGet("depreciation/{assetId}")]
        public IActionResult GetDepreciation(Guid assetId, [FromQuery] double purchasePrice, [FromQuery] int yearsOwned)
        {
            // Logic: Straight-line depreciation calculation (Standard ERP logic)
            double annualDepreciation = purchasePrice / 10; // 10 year useful life
            double currentDepreciation = annualDepreciation * yearsOwned;
            double bookValue = purchasePrice - currentDepreciation;

            return Ok(new 
            { 
                AssetId = assetId,
                CurrentBookValue = Math.Max(bookValue, purchasePrice * 0.05),
                DepreciationMethod = "Straight-Line"
            });
        }
    }

    public class ProcurementRequest
    {
        public string VIN { get; set; } = string.Empty;
        public double Price { get; set; }
        public string Vendor { get; set; } = string.Empty;
    }
}
