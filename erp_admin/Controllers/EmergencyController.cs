using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class EmergencyController : ControllerBase
    {
        [HttpGet("hospitals")]
        public IActionResult GetHospitals()
        {
            return Ok(new List<object>
            {
                new { ID = 1, Name = "Dubai Hospital", Lat = 25.27, Lng = 55.33, Capacity = "LOW", Specialties = "TRAUMA,CARDIAC" },
                new { ID = 2, Name = "Rashid Hospital", Lat = 25.24, Lng = 55.31, Capacity = "HIGH", Specialties = "TRAUMA,BURN" },
                new { ID = 3, Name = "Mediclinic City", Lat = 25.22, Lng = 55.32, Capacity = "OPTIMAL", Specialties = "PEDIATRIC,CARDIAC" }
            });
        }

        [HttpPost("crew/status")]
        public IActionResult UpdateCrewStatus([FromBody] CrewStatusRequest req)
        {
            // Logic: Update paramedic/EMT status in DB
            return Ok(new { Status = "Crew Status Updated", CrewID = req.CrewID, NewStatus = req.Status });
        }

        [HttpGet("hospital/{id}/capacity")]
        public IActionResult GetHospitalCapacity(int id)
        {
            return Ok(new { HospitalID = id, AvailableBeds = 14, ERWaitTimeMins = 25 });
        }
    }

    public class CrewStatusRequest
    {
        public int CrewID { get; set; }
        public string Status { get; set; } // "ON_DUTY", "OFF_DUTY", "ON_BREAK"
    }
}
