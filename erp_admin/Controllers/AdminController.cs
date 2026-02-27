using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ERPAdmin.Controllers
{
    [ApiController]
    [Route("api/erp/[controller]")]
    public class TenantController : ControllerBase
    {
        private static List<object> _tenants = new List<object>
        {
            new { Id = 1, Name = "Dubai Health Authority", Slug = "dha-ems", Status = "Active" },
            new { Id = 2, Name = "RTA", Slug = "rta-traffic", Status = "Active" }
        };

        [HttpGet]
        public IActionResult GetAllTenants()
        {
            return Ok(_tenants);
        }

        [HttpPost("provision")]
        public IActionResult ProvisionTenant([FromBody] dynamic tenant)
        {
            // Logic for automating infrastructure provisioning
            return CreatedAtAction(nameof(GetAllTenants), new { status = "Provisioning Started" });
        }
    }

    [ApiController]
    [Route("api/erp/[controller]")]
    public class ComplianceController : ControllerBase
    {
        [HttpGet("audit/{tenantId}")]
        public IActionResult RunAudit(int tenantId)
        {
            return Ok(new 
            { 
                TenantId = tenantId, 
                ComplianceStatus = "Pass", 
                Score = 98, 
                LastAudit = System.DateTime.Now 
            });
        }
    }
}
