using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Types
{
    public static class StringExtension
    {
        public static string RemoveDiacritics(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;
            value = value.Normalize(System.Text.NormalizationForm.FormD);

            //Traitement spécial pour ces 2 caractères
            value = value.Replace("œ", "oe");
            value = value.Replace("æ", "ae");

            var chars = value.Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark).ToArray();
            return new string(chars).Normalize(System.Text.NormalizationForm.FormC);
        }

        public static string RemoveLeadingChars(this string value, char[] charsToRemove)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;

            return new string(value.SkipWhile(c => charsToRemove.Contains(c)).ToArray());
        }

        public static string RemoveLeadingChars(this string value, string charsToRemove)
        {
            char[] chars = charsToRemove.ToArray();
            return RemoveLeadingChars(value, chars);
        }

    }


}
