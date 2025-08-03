# Project Agents.md Guide for AgentForge

This Agents.md file provides comprehensive guidance for AI agents and human developers working with this codebase, adhering to the Agents.md standard.

## Core Concept: Understanding Agents.md

Agents.md is a specialized documentation file designed to guide AI agents in understanding and working with your codebase. It provides context-specific information about your project's structure, conventions, and requirements. It serves as a communication bridge between the development team and AI tools, helping AI agents understand your project's specific requirements and standards.

## Project Structure for AgentForge Navigation

- `/`: The root directory of the AgentForge project, which now contains the Infrastructure as Code (IaC) managed by AWS CDK.
  - `cdk.json`: CDK application configuration.
  - `app.py`: Main CDK application entry point.
  - `iac_stack.py`: Defines the AWS CDK stack(s).
  - `.venv/`: Python virtual environment managed by `uv`.
  - `requirements-dev.txt`: Development dependencies.
  - `pyproject.toml`: Project metadata and core dependencies.
- `/docs`: Project documentation, including architectural decision records and diagrams.
- `/tests`: Project tests.

## Planning and Task Management

AgentForge adopts a hierarchical planning and task management approach, decomposing complex tasks into independently working, interoperating systems of smaller tasks. This is facilitated by `PLAN.md` for long-range planning and `TASK.md` for short-term, actionable tasks.

### PLAN.md: Overall Implementation Plan

- **Purpose**: `PLAN.md` serves as the overall, longer-range implementation plan for the AgentForge project. It outlines high-level project goals, major workstreams (epics), and strategic objectives.
- **Scope**: It focuses on decomposing complex project goals into interoperating systems, providing a roadmap for the C-Brain (Architect) and B-Brain (Engineer) agents.
- **Content**:
    - High-level project goals and vision.
    - Major features or epics.
    - Architectural considerations and design principles.
    - Dependencies between major workstreams.
    - Strategic decisions and their rationale.
- **Maintenance**: `PLAN.md` is a living document, updated as the project evolves and new strategic decisions are made.

### TASK.md: Short-Term Actionable Tasks

- **Purpose**: `TASK.md` defines shorter-term, actionable tasks derived from `PLAN.md`. These tasks are designed for direct execution by A-Brain (Coder) agents or human developers.
- **Scope**: Each task should be self-contained, focused, and designed for completion within a single chat session or a short, focused work period.
- **Characteristics**:
    - **Runnable**: Any code changes should be part of a runnable unit.
    - **Testable**: The results should be at least manually testable.
    - **Verifiable**: The task should produce a verifiable output.
    - **Decomposable**: If a task is too large or complex to be moderately likely to succeed in a single iteration, it should be further decomposed.
- **Content**:
    - Specific, well-defined coding or development objectives.
    - Clear input and expected output.
    - References to relevant sections in `PLAN.md` or other documentation.
    - Acceptance criteria.
- **Maintenance**: `TASK.md` is updated frequently, with new tasks being decomposed from `PLAN.md` based on priority and readiness.

## Coding Conventions

### General Conventions

- Use Python for all backend and IaC code.
- Follow existing code style in each file.
- Use meaningful variable and function names.
- Add comments for complex logic.

## Testing Requirements

- Run tests with `pytest`.
- Ensure all tests pass before merging changes.

## Command Execution Strategy

All `cdk` commands should now be executed from the project root, utilizing the `deploy.py` script for convenience.

Example:
```bash
# To deploy the CDK stack from the project root
python3 deploy.py
```

## Pull Request Guidelines

When creating a PR, please ensure it:
1. Includes a clear description of the changes.
2. References any related issues.
3. Ensures all tests pass.
4. Keeps PRs focused on a single concern.

## Programmatic Checks

Before submitting changes, run:

```bash
# Lint check
ruff check .

# Type check (if applicable)
mypy .

# Build check (if applicable)
# cdk synth
```

All checks must pass before code can be merged.
