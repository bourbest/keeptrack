using FluentValidation;
using KT.Data.Models;


namespace KT.Data.Validators
{
    public class ClientFileValidator : AbstractValidator<ClientFile>
    {
        public ClientFileValidator()
        {
            RuleFor(x => x.FirstName)
                .NotNull()
                .NotEmpty()
                .WithMessage("Name is required");
        }
    }
}
