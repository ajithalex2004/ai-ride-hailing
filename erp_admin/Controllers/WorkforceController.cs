using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class WorkforceController : ControllerBase
    {
        // Mock certification database
        private static List<dynamic> _certs = new List<dynamic>
        {
            new { Id = 1, DriverId = 101, Type = "LICENSE", Expiry = DateTime.Now.AddDays(15), Status = "ACTIVE" },
            new { Id = 2, DriverId = 102, Type = "EMERGENCY_OPS", Expiry = DateTime.Now.AddDays(-5), Status = "EXPIRED" }
        };

        [HttpGet("certs/{driverId}")]
        public IActionResult GetCerts(int driverId) => Ok(_certs.Where(c => (int)c.DriverId == driverId));

        [HttpPost("schedule-training")]
        public IActionResult ScheduleTraining([FromBody] TrainingScheduleRequest req)
        {
            // Logic: Register mandatory training event
            return Ok(new 
            { 
                EventId = Guid.NewGuid(),
                Status = "Scheduled",
                Course = req.CourseName,
                Date = req.ScheduledDate
            });
        }

        [HttpGet("compliance-audit")]
        public IActionResult RunAudit()
        {
            var issues = _certs.Where(c => (string)c.Status == "EXPIRED").ToList();
            return Ok(new 
            { 
                AuditTimestamp = DateTime.Now,
                ComplianceScore = 100 - (issues.Count * 5),
                CriticalIssues = issues
            });
        }
    }

    public class TrainingScheduleRequest
    {
        public int DriverId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
    }
}
