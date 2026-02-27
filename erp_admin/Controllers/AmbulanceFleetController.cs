using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class AmbulanceFleetController : ControllerBase
    {
        [HttpGet("inventory/readiness")]
        public IActionResult GetEquipmentReadiness()
        {
            return Ok(new List<object>
            {
                new { AmbulanceID = 101, OxygenLevel = "98%", DefibStatus = "READY", ChecklistComplete = true },
                new { AmbulanceID = 102, OxygenLevel = "22%", DefibStatus = "SERVICE_REQUIRED", ChecklistComplete = false },
                new { AmbulanceID = 103, OxygenLevel = "85%", DefibStatus = "READY", ChecklistComplete = true }
            });
        }

        [HttpPost("crew/schedule")]
        public IActionResult ScheduleCrew([FromBody] CrewScheduleRequest req)
        {
            // Logic: Assign crew to ambulance and verify certifications
            return Ok(new { 
                Status = "Crew Scheduled", 
                ShiftID = Guid.NewGuid(), 
                CertificationStatus = "VERIFIED",
                AmbulanceID = req.AmbulanceID 
            });
        }

        [HttpGet("crew/{id}/certification")]
        public IActionResult GetCrewCertification(int id)
        {
            return Ok(new { 
                CrewID = id, 
                LicenseType = "PARAMEDIC_ADV", 
                Expiry = DateTime.Now.AddMonths(8), 
                IsValid = true 
            });
        }
    }

    public class CrewScheduleRequest
    {
        public int CrewID { get; set; }
        public int AmbulanceID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
