using System;
using MongoDB.Bson.Serialization.Attributes;
using Microsoft.AspNet.Identity;
using Common.Data;
using Newtonsoft.Json;
using System.Security.Principal;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;

namespace KT.Data.Models
{
    public class KTClaimTypes
    {
        public const string FirstName = "KT:FirstName";
        public const string LastName = "KT:LastName";
        public const string Roles = "KT:Roles";
        public const string OrganismRole = "KT:OrganismRole";
    }

    public class UserIdentity : IUser<string>, IModel<string>
    {
        public UserIdentity()
        {
            Id = Guid.NewGuid().ToString();
        }

        public UserIdentity(IPrincipal principal)
        {
            Id = Guid.NewGuid().ToString();
            if (principal != null)
                LoadPrincipal(principal);
        }

        public UserIdentity(ClaimsIdentity claimsIdentity)
        {
            Id = Guid.NewGuid().ToString();
            if (claimsIdentity != null && claimsIdentity.Claims != null)
                LoadClaims(claimsIdentity.Claims);
        }

        // Interface IUser
        private string _id; 
        [BsonId]
        public string Id
        {
            get { return _id; }
            set
            {
                _id = value;
                SetClaim(ClaimTypes.NameIdentifier, value);
            }
        }

        private string _userName = string.Empty;
        public string UserName
        {
            get { return _userName; }
            set
            {
                _userName = value.ToLower();
                SetClaim(ClaimTypes.Name, _userName);
            }
        }

        private string _email = string.Empty;
        public string Email
        {
            get { return _email; }
            set
            {
                _email = value.ToLower();
                SetClaim(ClaimTypes.Email, _email);
            }
        }

        // KT specific data
        [JsonIgnore]
        public string PasswordHash { get; set; }
        [JsonIgnore]
        public string SecurityStamp { get; set; }

        private string _firstName = string.Empty;
        public string FirstName
        {
            get { return _firstName; }
            set
            {
                _firstName = (value != null ? value : string.Empty);
                SetClaim(KTClaimTypes.FirstName, _firstName);
            }
        }

        private string _lastName = string.Empty;
        public string LastName
        {
            get { return _lastName; }
            set
            {
                _lastName = (value != null ? value : string.Empty);
                SetClaim(KTClaimTypes.LastName, _lastName);
            }
        }

        public bool IsArchived { get; set; }

        [BsonIgnore]
        [JsonIgnore]
        public string Name { get { return $"{FirstName} {LastName}"; } }

        private HashSet<string> _roles = new HashSet<string>();
        public IEnumerable<string> Roles
        {
            get { return _roles; }
            set
            {
                if (value != null)
                    _roles = new HashSet<string>(value);
                else
                    _roles = new HashSet<string>();

                string strPerm = string.Join(",", _roles.AsEnumerable());
                SetClaim(KTClaimTypes.Roles, strPerm);
            }
        }

        private string _organismRole;
        public string OrganismRole
        {
            get { return _organismRole; }
            set
            {
                _organismRole = (value != null ? value : string.Empty); ;
                SetClaim(KTClaimTypes.OrganismRole, _organismRole);
            }
        }

        public bool HasPermission(string permissionName)
        {
            return _roles.Contains(permissionName);
        }

        public bool HasAnyPermission(IEnumerable<string> permissions)
        {
            return permissions.Any(p => _roles.Contains(p));
        }

        private List<Claim> _claims = new List<Claim>();

        [BsonIgnore]
        [JsonIgnore]
        public IEnumerable<Claim> Claims { get { return _claims; } }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }
        

        private void LoadPrincipal(IPrincipal principal)
        {
            if (principal != null && principal.Identity != null)
            {
                ClaimsIdentity claimsIdentity = principal.Identity as ClaimsIdentity;
                if (claimsIdentity.Claims != null)
                    LoadClaims(claimsIdentity.Claims);
            }
        }

        private void LoadClaims(IEnumerable<Claim> claims)
        {
            if (claims != null)
            {
                foreach (var claim in claims)
                {
                    switch (claim.Type)
                    {
                        case KTClaimTypes.FirstName: this.FirstName = claim.Value; break;
                        case KTClaimTypes.LastName: this.LastName = claim.Value; break;
                        case KTClaimTypes.OrganismRole: this.OrganismRole = claim.Value; break;
                        case ClaimTypes.NameIdentifier: this.Id = claim.Value; break;
                        case ClaimTypes.Name: this.UserName = claim.Value; break;
                        case KTClaimTypes.Roles:
                            string[] permissions = claim.Value.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                            _roles = new HashSet<string>(permissions);
                            break;

                        default:
                            SetClaim(claim.Type, claim.Value);
                            break;
                    }
                }
            }
        }

        private void SetClaim(string type, object value)
        {
            _claims.RemoveAll(c => c.Type == type);
            string val = value != null ? value.ToString() : string.Empty;
            _claims.Add(new Claim(type, val));
        }

    }
}
