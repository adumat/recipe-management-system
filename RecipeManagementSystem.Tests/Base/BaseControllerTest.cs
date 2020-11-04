using AutoMapper;
using RecipeManagementSystem.Models;
using Xunit.Abstractions;

namespace RecipeManagementSystem.Tests
{
    public class BaseControllerTest : BaseTest
    {
        public BaseControllerTest(ITestOutputHelper output) : base(output)
        {
            mapper = new MapperConfiguration(cfg => {
                cfg.AddMaps(new [] {
                    typeof(MappingProfile)
                });
            }).CreateMapper();
        }

        protected IMapper mapper { get; }
    }
}