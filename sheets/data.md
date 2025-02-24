# Baseline					

| Criteria | Scrum | XP | Kanban | Scrumban | Our Method |
|----------|------:|---:|-------:|---------:|-----------:|
| Team size | 5 | 4 | 3 | 4 | 4 |
| Team distribution | 2 | 2 | 5 | 4 | 5 |
| Application Criticality | 2 | 2 | 3 | 3 | 4 |
| Requirement Volatility | 4 | 5 | 5 | 5 | 5 |
| Development Speed | 5 | 5 | 4 | 5 | 5 |
| Cost Management | 3 | 3 | 5 | 4 | 4 |
| Scalability | 3 | 2 | 4 | 4 | 5 |
| Quality Assurance | 4 | 5 | 3 | 4 | 5 |
| Workflow Efficiency | 4 | 4 | 5 | 5 | 5 |



# Weighted Score				

| Criteria | Scrum | XP | Kanban | Scrumban | Our Method |
|----------|------:|---:|-------:|---------:|-----------:|
| Team size | 0.5 | 0.4 | 0.3 | 0.4 | 0.4 |
| Team distribution | 0.3 | 0.3 | 0.75 | 0.6 | 0.75 |
| Application Criticality | 0.1 | 0.1 | 0.15 | 0.15 | 0.2 |
| Requirement Volatility | 0.8 | 1 | 1 | 1 | 1 |
| Development Speed | 0.6 | 0.6 | 0.48 | 0.6 | 0.6 |
| Cost Management | 0.24 | 0.24 | 0.4 | 0.32 | 0.32 |
| Scalability | 0.3 | 0.2 | 0.4 | 0.4 | 0.5 |
| Quality Assurance | 0.28 | 0.35 | 0.21 | 0.28 | 0.35 |
| Workflow Efficiency | 0.52 | 0.52 | 0.65 | 0.65 | 0.65 |

# Criteria Weights

| Criteria | Weight |
|----------|-------:|
| Team size | 0.1 |
| Team distribution | 0.15 |
| Application Criticality | 0.05 |
| Requirement Volatility | 0.2 |
| Development Speed | 0.12 |
| Cost Management | 0.08 |
| Scalability | 0.1 |
| Quality Assurance | 0.07 |
| Workflow Efficiency | 0.13 |

# Total Weighted Score	

| Method | Weighted Average Score |
|--------|----------------------:|
| Scrum | 3.64 |
| XP | 3.71 |
| Kanban | 4.34 |
| Scrumban | 4.4 |
| Our Method | 4.77 |



# our process
| Process Step | Description |
|-------------|-------------|
| Focus on Method Over Practices | Rather than evaluating individual practices, we focused on entire methods to determine which approach best aligned with SALL-E's needs. This gave us a broader and more strategic outlook, ensuring that our selected practices would be better suited than conventional methods. |
| Identify Key Criteria | We first determined which criteria were most relevant to the SALL-E project by evaluating their impact on the method selection. This was based on our justification sheet, where we outlined the reasoning behind each criteria. |
| Define Facts & Assumptions | For each criteria, we documented facts and assumptions specific to SALL-E to ensure our evaluation was grounded in project constraints. We then created a scaled interpretation to standardize how we assigned values for the MAUT analysis. |
| Assign Weights | We applied weights to each criterion based on its importance to SALL-E. This ensured that the most critical factors (e.g., requirement volatility, team distribution) had a greater influence on our decision-making. |
| Score Methodologies | Each of us independently voted on how each method would score relative to the predefined scale. This helped eliminate bias and ensured a balanced assessment. |
| Apply Weighted Scores | We multiplied the baseline values of each method by the assigned weights, calculating an overall score to compare methods objectively. |


# Facts, Assumptions, Scale Interpretation


| Criteria | Facts & Assumptions for SALL-E Project Criteria | Scale Interpretation |
|----------|-------------------------------------------|----------------------|
| Team Size | Fact: The NDSS / SALL-E team consists of fewer than 15 people (PRD specifies 8 in San Jose, 3 in Tampa). The team is cross-functional (developers, product managers, engineering managers). Assumption: Since the team is small, lightweight methodologies (e.g., Scrum, Kanban) are preferred. Overhead-heavy processes (like SAFe or large-scale RUP) would not be efficient. | 1 pts = Large team (50+ members), Requires complex governance. 2 pts = Medium-sized team (30–50 members), Needs structured processes. 3 pts = Small team (15–30 members), Can balance Agile with structure. 4 pts = Lean team (<15 members), Prefers lightweight methodologies. 5 pts = Very small team (<10 members), Agile & fast iterations are ideal. |
| Team Distribution | Fact: Team is distributed globally across San Jose & Tampa. Assumption: Asynchronous communication and strong collaboration tools (Slack, Jira) are required. | 1 pts = Fully co-located team in one office. 2 pts = Mostly co-located with some remote members. 3 pts = Hybrid team (partially remote). 4 pts = Majority distributed across different locations. 5 pts = Fully distributed across multiple time zones. |
| Application Criticality | Fact: The platform is not mission-critical but affects workforce productivity and contractor payments. Assumption: Stability is important, but occasional downtime is tolerable. | 1 pts = High-risk system (e.g., medical, aerospace). 2 pts = Critical financial system (e.g., stock trading). 3 pts = Medium-criticality (e.g., HR software, contractor payments). 4 pts = Low-medium impact (some downtime tolerable). 5 pts = Non-critical system (e.g., internal tools, hobby apps). |
| Requirement Volatility | Fact: The PRD states that requirements may evolve as new startups onboard. Assumption: The methodology must support rapid adaptation to changes. | 1 pts = Very stable requirements (e.g., government projects). 2 pts = Mostly stable, minor changes expected. 3 pts = Some moderate changes, needs flexibility. 4 pts = High volatility, frequent requirement shifts. 5 pts = Extremely volatile, rapidly changing priorities. |
| Development Speed | Fact: The time to launch is a success metric, requiring fast iterations. Assumption: CI/CD pipelines and automated testing are essential for rapid delivery. | 1 pts = Long-term development (>1 year). 2 pts = Medium-speed project, no urgent deadlines. 3 pts = Balanced speed vs. quality. 4 pts = Rapid development required. 5 pts = Extreme speed (MVP in weeks, continuous deployment). |
| Cost Management | Fact: NDSS wants to control costs while ensuring quality. Assumption: Lean principles should minimize waste and optimize spending. | 1 pts = Unlimited budget, cost is not a concern. 2 pts = High budget, but cost-conscious. 3 pts = Moderate budget, needs cost optimization. 4 pts = Tight budget, needs efficiency. 5 pts = Very limited budget, requires strict cost control. |
| Scalability | Fact: PRD states SALL-E will expand to support more users and clients over time. Assumption: The system must be modular and cloud-based for growth. | 1 pts = Small, single-use application. 2 pts = Some scalability but not a priority. 3 pts = Needs moderate scalability. 4 pts = Needs strong scalability. 5 pts = High growth expected, must scale rapidly. |
| Quality Assurance | Fact: The PRD emphasizes ensuring reliability and minimizing downtime. Assumption: TDD, automated testing, and peer code reviews will be needed. | 1 pts = Low emphasis on quality, testing not a priority. 2 pts = Minimal QA, only functional testing. 3 pts = Moderate QA, some automation and code reviews. 4 pts = Strong QA, TDD, automated testing, code reviews. 5 pts = Very high quality standards, rigorous testing required. |
| Workflow Efficiency | Fact: The small team size means that workflow bottlenecks must be minimized. Assumption: Kanban (with WIP limits) and backlog prioritization (MoSCoW method) can improve efficiency. | 1 pts = Poor workflow efficiency, lots of bottlenecks. 2 pts = Some delays, but manageable. 3 pts = Moderate efficiency, room for improvement. 4 pts = Well-structured workflow, smooth progress. 5 pts = Highly optimized workflow, minimal delays. |