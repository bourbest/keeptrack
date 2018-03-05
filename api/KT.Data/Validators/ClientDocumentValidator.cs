using FluentValidation;
using KT.Data.Models;


namespace KT.Data.Validators
{
    public class ClientDocumentValidator : AbstractValidator<ClientDocument>
    {
        public ClientDocumentValidator()
        {
            RuleFor(x => x.ClientId)
                .NotEmpty()
                .WithMessage("ClientId is required");

            RuleFor(x => x.FormId)
                .NotEmpty()
                .WithMessage("ClientId is required");
        }
    }
}
