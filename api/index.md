The API served here requires no API key. All data will be served via JSON. The url is `https://ubcgrades.com/api/`

## Retrieve Grade Distributions
Endpoint (Required parameters are bolded) | Description | Example (Click for response)| Error Response
---|---|---|---
/grades/**yearsession**/**subject**/**course**/**section** | Retreives a grade distribution report for a single section | [http://127.0.0.1:5000/api/grades/2018W/MATH/100/101](http://127.0.0.1:5000/api/grades/2018W/MATH/100/101) | `{}`
/grades/**yearsession**/**subject**/**course** | Retreives a grade distribution report for a course | [http://127.0.0.1:5000/api/grades/2018W/MATH/100](http://127.0.0.1:5000/api/grades/2018W/MATH/100) | `{}`
/grades/**yearsession**/**subject** | Retreives a grade distribution report for a subject | [http://127.0.0.1:5000/api/grades/2018W/POLI](http://127.0.0.1:5000/api/grades/2018W/POLI) | `{}`
/grades/**yearsession** | Retreives a grade distribution report for yearsession | [http://127.0.0.1:5000/api/grades/2017S](http://127.0.0.1:5000/api/grades/2017S) | `{}`
/grades/**yearsession**/**subject**/**course**/**section** | Retreives a grade distribution report for a single section | [http://127.0.0.1:5000/api/grades/2018W/MATH/100/101](http://127.0.0.1:5000/api/grades/2018W/MATH/100/101) | `{}`

## Filter Data
Endpoint (Required parameters are bolded) | Description | Example (Click for response)| Error Response
---|---|---|---
/sections/**yearsession**/**subject**/**course** | Retreives all the section numbers under a particular course | [http://127.0.0.1:5000/api/sections/2018W/BIOL/200](http://127.0.0.1:5000/api/sections/2018W/BIOL/200) | `{}`
/courses/**yearsession**/**subject** | Retreives all the course labels under a particular subject and yearsession | [http://127.0.0.1:5000/api/courses/2018W/POLI](http://127.0.0.1:5000/api/courses/2018W/POLI) | `{}`
/courses/**subject** | Retrieves all the distinct course labels under a particular subject | [http://127.0.0.1:5000/api/courses/ELEC](http://127.0.0.1:5000/api/courses/ELEC) | `{}`
/subjects/**yearsession** | Retreives all distinct subjects under a particular yearsession| [http://127.0.0.1:5000/api/subjects/2016W](http://127.0.0.1:5000/api/subjects/2016W) | `{}`
/subjects | Retreives all distinct subjects across all yearsessions (no parameters)| [http://127.0.0.1:5000/api/subjects](http://127.0.0.1:5000/api/subjects) | `{}`
/yearsessions | Retreives all available yearsessions (no parameters)| [http://127.0.0.1:5000/api/yearsessions](http://127.0.0.1:5000/api/yearsessions) | `{}`

## Course Profile Data
Endpoints (Required parameters are bolded) | Description | Examples (Click for response)| Error Response
---|---|---|---
/course-profile/**subject** <br> /course-profile/**subject**/**course** | Retreives general data regarding course averages, pass percentage, etc. | [http://127.0.0.1:5000/api/course-profile/ENGL](http://127.0.0.1:5000/api/course-profile/ENGL) <br> [http://127.0.0.1:5000/api/course-profile/ENGL/112](http://127.0.0.1:5000/api/course-profile/ENGL/112) | `{}`
/course-profile/distributions/**subject** <br> /course-profile/distributions/**subject**/**course** | Retreives historical course distributions | [http://127.0.0.1:5000/api/course-profile/distributions/SCIE](http://127.0.0.1:5000/api/course-profile/distributions/SCIE) <br> [http://127.0.0.1:5000/api/course-profile/distributions/SCIE/001](http://127.0.0.1:5000/api/course-profile/distributions/SCIE/001) | `{}`
/course-profile/instructors/**subject** <br> /course-profile/instructors/**subject**/**course** | Retreives who and when instructors taught a course by yearsession | [http://127.0.0.1:5000/api/course-profile/instructors/LING](http://127.0.0.1:5000/api/course-profile/instructors/LING) <br> [http://127.0.0.1:5000/api/course-profile/instructors/LING/100](http://127.0.0.1:5000/api/course-profile/instructors/LING/100) | `{}`
/course-profile/offerings/**subject** <br> /course-profile/offerings/**subject**/**course** | Retrieves the number of grade-distribution-existing sections by yearsession | [http://127.0.0.1:5000/api/course-profile/offerings/KIN](http://127.0.0.1:5000/api/course-profile/offerings/KIN) <br> [http://127.0.0.1:5000/api/course-profile/offerings/KIN/110](http://127.0.0.1:5000/api/course-profile/offerings/KIN/110) | `{}`