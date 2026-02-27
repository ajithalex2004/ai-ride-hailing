using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class ComplianceController : ControllerBase
    {
        [HttpGet("tax-rules")]
        public IActionResult GetTaxRules() => Ok(new List<object>
        {
            new { Region = "UAE", VAT = 0.05, CorporateTax = 0.09 },
            new { Region = "KSA", VAT = 0.15, CorporateTax = 0.20 },
            new { Region = "QAT", VAT = 0.00, CorporateTax = 0.10 }
        });

        [HttpPost("calculate-tax")]
        public IActionResult CalculateTax([FromBody] TaxRequest req)
        {
            double rate = req.Region == "UAE" ? 0.05 : req.Region == "KSA" ? 0.15 : 0;
            return Ok(new 
            {
                BaseAmount = req.Amount,
                TaxAmount = req.Amount * rate,
                Total = req.Amount * (1 + rate),
                Region = req.Region
            });
        }

        [HttpGet("driver-status/{driverId}")]
        public IActionResult GetDriverCompliance(int driverId)
        {
            return Ok(new 
            {
                DriverID = driverId,
                Status = "COMPLIANT",
                LicenseExpiry = DateTime.Now.AddDays(120),
                MedicalCert = "VALID",
                RiskScore = 0.05
            });
        }
    }

    public class TaxRequest
    {
        public double Amount { get; set; }
        public string Region { get; set; }
    }
}
