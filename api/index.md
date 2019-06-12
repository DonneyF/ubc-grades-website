The API served here requires no API key. All data will be served via JSON. The url is `https://ubcgrades.com/api`

#### Quick Definitions
Key | Description | Examples
--- | --- | --
yearsession | A 5-character string whose first 4 characters is a year and last character is either `W` for winter or `S` for summer. | 2018W, 2012S
subject | A 2-4 character string that represents a subject code. | BA, KIN, APSC
course | A 3-4 character string whose first three characters is a three-digit number. The optional fourth character is a detail modifier. | 001, 200, 230A, 342C
section | A 3-character string that represents a section in a course. This can be a lecture, tutorial, lab, etc. | 001, 100, GIS, T1A

## Retrieve Grade Distributions
Endpoint (Required parameters are bolded) | Description | Example (Click for response)| Error Response
---|---|---|---
/grades/**yearsession**/**subject**/**course**/**section** | Retreives a grade distribution report for a single section | [https://ubcgrades.com/api/grades/2018W/MATH/100/101](https://ubcgrades.com/api/grades/2018W/MATH/100/101) | `{}`
/grades/**yearsession**/**subject**/**course** | Retreives a grade distribution report for a course | [https://ubcgrades.com/api/grades/2018W/MATH/100](https://ubcgrades.com/api/grades/2018W/MATH/100) | `{}`
/grades/**yearsession**/**subject** | Retreives a grade distribution report for a subject | [https://ubcgrades.com/api/grades/2018W/POLI](https://ubcgrades.com/api/grades/2018W/POLI) | `{}`
/grades/**yearsession** | Retreives a grade distribution report for yearsession | [https://ubcgrades.com/api/grades/2017S](https://ubcgrades.com/api/grades/2017S) | `{}`
/grades/**yearsession**/**subject**/**course**/**section** | Retreives a grade distribution report for a single section | [https://ubcgrades.com/api/grades/2018W/MATH/100/101](https://ubcgrades.com/api/grades/2018W/MATH/100/101) | `{}`

## Filter Data
Endpoint (Required parameters are bolded) | Description | Example (Click for response)| Error Response
---|---|---|---
/sections/**yearsession**/**subject**/**course** | Retreives all the section numbers under a particular course | [https://ubcgrades.com/api/sections/2018W/BIOL/200](https://ubcgrades.com/api/sections/2018W/BIOL/200) | `[]`
/courses/**yearsession**/**subject** | Retreives all the course labels under a particular subject and yearsession | [https://ubcgrades.com/api/courses/2018W/POLI](https://ubcgrades.com/api/courses/2018W/POLI) | `[]`
/courses/**subject** | Retrieves all the distinct course labels under a particular subject | [https://ubcgrades.com/api/courses/ELEC](https://ubcgrades.com/api/courses/ELEC) | `[]`
/subjects/**yearsession** | Retreives all distinct subjects under a particular yearsession| [https://ubcgrades.com/api/subjects/2016W](https://ubcgrades.com/api/subjects/2016W) | N/A
/subjects | Retreives all distinct subjects across all yearsessions (no parameters)| [https://ubcgrades.com/api/subjects](https://ubcgrades.com/api/subjects) | `[]`
/yearsessions | Retreives all available yearsessions (no parameters)| [https://ubcgrades.com/api/yearsessions](https://ubcgrades.com/api/yearsessions) | N/A

## Course Profile Data
Endpoints (Required parameters are bolded) | Description | Examples (Click for response)| Error Response
---|---|---|---
/course-profile/**subject** <br> /course-profile/**subject**/**course** | Retreives general data regarding course averages, pass percentage, etc. | [https://ubcgrades.com/api/course-profile/ENGL](https://ubcgrades.com/api/course-profile/ENGL) <br> [https://ubcgrades.com/api/course-profile/ENGL/112](https://ubcgrades.com/api/course-profile/ENGL/112) | `{}`
/course-profile/distributions/**subject** <br> /course-profile/distributions/**subject**/**course** | Retreives historical course distributions | [https://ubcgrades.com/api/course-profile/distributions/SCIE](https://ubcgrades.com/api/course-profile/distributions/SCIE) <br> [https://ubcgrades.com/api/course-profile/distributions/SCIE/001](https://ubcgrades.com/api/course-profile/distributions/SCIE/001) | `[]`
/course-profile/instructors/**subject** <br> /course-profile/instructors/**subject**/**course** | Retreives who and when instructors taught a course by yearsession | [https://ubcgrades.com/api/course-profile/instructors/LING](https://ubcgrades.com/api/course-profile/instructors/LING) <br> [https://ubcgrades.com/api/course-profile/instructors/LING/100](https://ubcgrades.com/api/course-profile/instructors/LING/100) | `[]`
/course-profile/offerings/**subject** <br> /course-profile/offerings/**subject**/**course** | Retrieves the number of grade-distribution-existing sections by yearsession | [https://ubcgrades.com/api/course-profile/offerings/KIN](https://ubcgrades.com/api/course-profile/offerings/KIN) <br> [https://ubcgrades.com/api/course-profile/offerings/KIN/110](https://ubcgrades.com/api/course-profile/offerings/KIN/110) | `{}`


# Download Data

Here you can download **raw** data as one might obtain directly from PAIR. The contained CSVs are **unmodified** and contains some errors or inconsistencies:

- Certain rows are duplicated by everything except for the `Professor` column. Most of the time there one field will be empty and the other will be populated. In a few cases, all `Professor` columns will be non-empty and contain different entries. My solution to this was manually looking up the section info from PAIR and adjusting the section as necessary. You can download the correction JSON file here: [UBC](https://files.ubcgrades.com/file/ubcgrades/UBC-instructor-corrections.json)
    - An exeption to this is `UBC-2007W-DENT-420-PSI` whose row is simply duplicated with no changes.
- `OVERALL` sections are generated on the basis of the course code for the year, rather than per-section. As such there will be numerous `OVERALL` rows if a course has a detail field.
- The CSV data may conflict with the section data shown on PAIR.

Note: As of June 2019, the 2018W grades for UBC and UBCO still await further results from extraneous reasons such as standing deferred and cancelled exams. The data here will be updated mid-September 2019.

## UBC Vancouver

File name and download | File Size | SHA-1 Checksum | Last Update 
--- | --- | --- | ---
[UBC.zip](https://files.ubcgrades.com/file/ubcgrades/UBC.zip) | 10.4 MiB | 8e1de4d468072e4e235cc8521d56a603ff4e540b | June 2019
[UBC-2018W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2018W.zip) | 427.0 KiB | d121d2e4c8448217c6bb69c921b11881b5c5dd2e | June 2019
[UBC-2018S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2018S.zip) | 110.9 KiB | 925c2c2a403db844d7e058c336b17f09432ecc56 | June 2019
[UBC-2017W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2017W.zip) | 425.9 KiB | 942dac25c426446016a6f7834130025af3c13867 | June 2019
[UBC-2017S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2017S.zip) | 109.9 KiB | dc5c5387041f72532a65d40c769a1570942facbb | June 2019
[UBC-2016W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2016W.zip) | 422.5 KiB | c22f6132faa905463b481a891351d0f47bc726c3 | June 2019
[UBC-2016S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2016S.zip) | 107.9 KiB | f630694782418b9b6dd6398f3d9352209b4654ec | June 2019
[UBC-2015W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2015W.zip) | 418.5 KiB | 3e9c83c4d47855f82240e17fe4338fdfdff268d2 | June 2019
[UBC-2015S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2015S.zip) | 104.0 KiB | e73af11bdcba81866c3a84df65c19aef31e1b587 | June 2019
[UBC-2014W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2014W.zip) | 405.1 KiB | 994c242d6404c24abb5390fe473f8331f0d03e20 | June 2019
[UBC-2014S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2014S.zip) | 102.2 KiB | ff9f833b69b86e244522723dc35074925e9709db | June 2019
[UBC-2013W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2013W.zip) | 401.5 KiB | 0b4fd5752cbb9fbddd5c0f2401fa63fec83e3524 | June 2019
[UBC-2013S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2013S.zip) | 105.9 KiB | b10ca7bd3e6da42a11e8ff5ed0b1edd83f7f4775 | June 2019
[UBC-2012W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2012W.zip) | 398.5 KiB | f876c9dd5816561f7d99a0e4bce3d893dba43185 | June 2019
[UBC-2012S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2012S.zip) | 104.3 KiB | 8e7190eb7a138df44fecf880209602d622278ea8 | June 2019
[UBC-2011W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2011W.zip) | 399.6 KiB | 94402d1d0c38b171deda87a2e6e2c283bb317f50 | June 2019
[UBC-2011S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2011S.zip) | 104.9 KiB | b67c93d519395024fddf65f5ec91d1519ace3c8f | June 2019
[UBC-2010W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2010W.zip) | 397.6 KiB | 42ef847c7b2343c9ebcfa84a3ac6f82f665035e2 | June 2019
[UBC-2010S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2010S.zip) | 106.5 KiB | a28b0ddd21f605864a9ca19c972101c2c2d7ee61 | June 2019
[UBC-2009W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2009W.zip) | 399.1 KiB | ce8f48a42ec6a844433f4540ebe8fddea51b0d99 | June 2019
[UBC-2009S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2009S.zip) | 108.4 KiB | 475a4ee5b974c3a617cdcdca73258469126ccc85 | June 2019
[UBC-2008W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2008W.zip) | 339.4 KiB | 2b8d89b268e877d7009c340ef7a5321eb76fb97f | June 2019
[UBC-2008S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2008S.zip) | 95.6 KiB | 0af5eba4a85dd68b29ab86aef4c4d1170c2ba7d8 | June 2019
[UBC-2007W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2007W.zip) | 381.4 KiB | fa2462e23e6fda8915acad4a5435f9e6e09cce67 | June 2019
[UBC-2007S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2007S.zip) | 92.7 KiB | 397c51d4395e1ad747e1b07e97bacf971800bfb0 | June 2019
[UBC-2006W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2006W.zip) | 383.0 KiB | 6954a5a219a931edfa1f8b47028b7729eaa31a73 | June 2019
[UBC-2006S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2006S.zip) | 95.8 KiB | 9c99ac12301ec955f9ea320617058ca25b23b079 | June 2019
[UBC-2005W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2005W.zip) | 380.5 KiB | b0ee644e8ed3bc287394b5eb901b4c7c305dce58 | June 2019
[UBC-2005S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2005S.zip) | 91.9 KiB | 4adbead36e0c8da477cb595738e0e27bfe7732a5 | June 2019
[UBC-2004W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2004W.zip) | 328.2 KiB | 1332920653270def32d9297e0990e63d783d58c3 | June 2019
[UBC-2004S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2004S.zip) | 89.8 KiB | 18093fb591214eb555c2acc94725a2dc854ad1dc | June 2019
[UBC-2003W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2003W.zip) | 366.5 KiB | 58a6cb97ca7dc55ea6a5e83ed3d3d7f7020e39c1 | June 2019
[UBC-2003S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2003S.zip) | 87.8 KiB | a9e8ad0f4c72e39d2ac9cfa86891403bcc5647aa | June 2019
[UBC-2002W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2002W.zip) | 353.5 KiB | 43aa0ebc4c89a111de584227433b0edb5c984d32 | June 2019
[UBC-2002S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2002S.zip) | 91.4 KiB | ecf94c9a97965dfa88f53d5b6334ba778d0afb41 | June 2019
[UBC-2001W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2001W.zip) | 296.7 KiB | 7962265fb7a1c0ee3f86922cbf8109d867743933 | June 2019
[UBC-2001S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2001S.zip) | 87.2 KiB | f9787ce7dfa5afd5084a92700bf492c2b495aa5e | June 2019
[UBC-2000W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2000W.zip) | 290.0 KiB | b199469f66a162c1e3921862481b6f2a7b6e8204 | June 2019
[UBC-2000S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-2000S.zip) | 86.5 KiB | f31de906d3f2ad51be6717c8563f991f2ef9047d | June 2019
[UBC-1999W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1999W.zip) | 288.9 KiB | a9b6ad7e77625eb93def2d6393c11ddb613df2c1 | June 2019
[UBC-1999S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1999S.zip) | 88.1 KiB | 68972b0c7763b47cb53a533f1330fc1f6b634a8a | June 2019
[UBC-1998W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1998W.zip) | 293.1 KiB | 7af2ebe142137c63a7fd900f22d8d6908446510d | June 2019
[UBC-1998S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1998S.zip) | 83.9 KiB | 3ddebe579fd53b6708bec5d4f25c1838877f98af | June 2019
[UBC-1997W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1997W.zip) | 290.2 KiB | e67bba41719116075cb5bdc047e5e9000d07bdf6 | June 2019
[UBC-1997S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1997S.zip) | 83.3 KiB | d27dda09b2bbf584428f46d6429c48fcb69e8ec5 | June 2019
[UBC-1996W.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1996W.zip) | 288.4 KiB | 2de7115c8c695e361947a2a5c316a726fef22af7 | June 2019
[UBC-1996S.zip](https://files.ubcgrades.com/file/ubcgrades/UBC-1996S.zip) | 82.7 KiB | 1b9a0a02afbed79acbc07ac9a7545de07c709a2a | June 2019