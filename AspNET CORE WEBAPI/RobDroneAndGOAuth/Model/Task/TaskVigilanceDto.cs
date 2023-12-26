using System.ComponentModel.DataAnnotations;

namespace RobDroneAndGOAuth.Model.Task
{
    public class TaskVigilanceDto
    {
        [Required]
        public string Floor { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [RegularExpression(@"^\d+$", ErrorMessage = "Phone number must be numeric")]
        public string phonenumber { get; set; }
    }
}
