using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class IncidentAssetController : ControllerBase
    {
        [HttpGet("tow/fleet")]
        public IActionResult GetTowFleet()
        {
            return Ok(new List<object>
            {
                new { ID = 1, VehicleNo = "TOW-001", Class = "HEAVY", Status = "AVAILABLE", LastService = DateTime.Now.AddDays(-12) },
                new { ID = 2, VehicleNo = "TOW-002", Class = "LIGHT", Status = "ON_JOB", LastService = DateTime.Now.AddDays(-5) },
                new { ID = 3, VehicleNo = "TOW-003", Class = "FLATBED", Status = "AVAILABLE", LastService = DateTime.Now.AddDays(-20) }
            });
        }

        [HttpGet("roadside/inventory")]
        public IActionResult GetRoadsideInventory()
        {
            return Ok(new { 
                Batteries = 24, 
                FuelBuckets_Petrol = 12, 
                FuelBuckets_Diesel = 8, 
                SpareTirePacks = 15 
            });
        }

        [HttpPost("tow/maintenance")]
        public IActionResult LogMaintenance([FromBody] MaintenanceLog req)
        {
            return Ok(new { Status = "Maintenance Logged", Vehicle = req.VehicleNo, NextService = DateTime.Now.AddMonths(3) });
        }
    }

    public class MaintenanceLog
    {
        public string VehicleNo { get; set; }
        public string Action { get; set; }
    }
}
