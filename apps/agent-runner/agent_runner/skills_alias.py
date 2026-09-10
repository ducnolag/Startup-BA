"""
agent_runner/skills_alias.py — Hybrid skill naming for Vietnamese localization.

Maps original skill names from commerce-agents to Vietnamese aliases
while preserving the original skill content.

Skill mapping:
- search-discovery       → "tìm & so sánh"
- planning-goals         → "lên kế hoạch"
- purchase-research      → "nghiên cứu trước mua"
- memory-personalization → "ghi nhớ & cá nhân hoá"
- customer-care          → "hỗ trợ sau mua"
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any


# Skill name mapping: original → Vietnamese alias
SKILL_ALIAS_MAP: dict[str, str] = {
    "search-discovery": "tìm & so sánh",
    "planning-goals": "lên kế hoạch",
    "purchase-research": "nghiên cứu trước mua",
    "memory-personalization": "ghi nhớ & cá nhân hoá",
    "customer-care": "hỗ trợ sau mua",
}

# Reverse mapping
ALIAS_TO_ORIGINAL: dict[str, str] = {v: k for k, v in SKILL_ALIAS_MAP.items()}


@dataclass
class SkillInfo:
    """Container for skill metadata and content."""
    original_name: str
    vn_alias: str
    description: str
    content: str
    file_path: str


def get_skills_base_path() -> Path:
    """Get the path to the skills directory in the reference repo."""
    # Path relative to this file's location
    base = Path(__file__).parent.parent.parent / "_refs" / "anthropics-commerce-agents" / "shopping-agent" / "skills"
    return base


def load_skill_from_file(skill_name: str, base_path: Path | None = None) -> SkillInfo | None:
    """
    Load a skill's SKILL.md file and return its content with alias.
    
    Args:
        skill_name: The original skill name (e.g., "search-discovery")
        base_path: Optional path to skills directory
    
    Returns:
        SkillInfo with original name, Vietnamese alias, and content
    """
    if base_path is None:
        base_path = get_skills_base_path()
    
    skill_path = base_path / skill_name / "SKILL.md"
    
    if not skill_path.exists():
        return None
    
    try:
        content = skill_path.read_text(encoding="utf-8")
    except Exception:
        return None
    
    # Parse description from the first non-empty line after the header
    description = _extract_description(content)
    
    return SkillInfo(
        original_name=skill_name,
        vn_alias=SKILL_ALIAS_MAP.get(skill_name, skill_name),
        description=description,
        content=content,
        file_path=str(skill_path),
    )


def _extract_description(content: str) -> str:
    """Extract description from skill markdown content."""
    lines = content.strip().split("\n")
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            # First non-header, non-empty line
            return line[:200]  # Truncate if too long
    return ""


def load_skills_with_aliases() -> dict[str, SkillInfo]:
    """
    Load all skills from the reference repo with Vietnamese aliases.
    
    Returns:
        Dict mapping Vietnamese alias → SkillInfo
    """
    base_path = get_skills_base_path()
    skills: dict[str, SkillInfo] = {}
    
    for original_name in SKILL_ALIAS_MAP.keys():
        skill_info = load_skill_from_file(original_name, base_path)
        if skill_info:
            skills[skill_info.vn_alias] = skill_info
    
    return skills


def build_skill_index(skills: dict[str, SkillInfo]) -> str:
    """
    Build a markdown skill index for the system prompt.
    
    Args:
        skills: Dict of loaded skills
    
    Returns:
        Formatted markdown string with skill list
    """
    lines = [
        "## Danh sách kỹ năng (Skills)",
        "",
        "| Kỹ năng | Mô tả |",
        "|----------|--------|",
    ]
    
    for alias, skill in sorted(skills.items()):
        desc = skill.description or "(không có mô tả)"
        lines.append(f"| **{alias}** | {desc} |")
    
    return "\n".join(lines)


def get_skill_content(alias: str, skills: dict[str, SkillInfo] | None = None) -> str | None:
    """
    Get the full content of a skill by its Vietnamese alias.
    
    Args:
        alias: Vietnamese skill alias
        skills: Optional pre-loaded skills dict
    
    Returns:
        Skill content as string, or None if not found
    """
    if skills is None:
        skills = load_skills_with_aliases()
    
    skill = skills.get(alias)
    return skill.content if skill else None


# =============================================================================
# Demo: load and format skills for system prompt
# =============================================================================

def get_formatted_skills_section() -> str:
    """
    Get the complete skills section for the system prompt.
    
    This combines the skill index with detailed content for each skill.
    """
    skills = load_skills_with_aliases()
    index = build_skill_index(skills)
    
    sections = [
        index,
        "",
        "---",
        "",
        "### Chi tiết kỹ năng",
        "",
    ]
    
    # Add a brief summary for each skill
    skill_summaries = {
        "tìm & so sánh": "Biến nhu cầu mua sắm thành danh sách sản phẩm ngắn gọn với gợi ý phù hợp. Áp dụng bộ lọc giá, thương hiệu, đánh giá.",
        "lên kế hoạch": "Giúp khách hàng xác định nhu cầu thực sự, so sánh các lựa chọn, và đưa ra quyết định mua hàng sáng suốt.",
        "nghiên cứu trước mua": "Cung cấp thông tin chi tiết về sản phẩm: specs, đánh giá từ người dùng, so sánh giữa các model.",
        "ghi nhớ & cá nhân hoá": "Nhớ preferences của khách hàng (thương hiệu yêu thích, mức giá, nhu cầu đặc biệt) để đưa ra gợi ý chính xác hơn.",
        "hỗ trợ sau mua": "Trả lời câu hỏi về đơn hàng, chính sách đổi trả, bảo hành, và các vấn đề sau mua hàng.",
    }
    
    for alias, skill in sorted(skills.items()):
        summary = skill_summaries.get(alias, skill.description or "")
        sections.append(f"#### {alias}")
        sections.append(f"{summary}")
        sections.append("")
    
    return "\n".join(sections)


if __name__ == "__main__":
    # Demo: load and display skills
    skills = load_skills_with_aliases()
    print(f"Loaded {len(skills)} skills:")
    for alias, skill in skills.items():
        print(f"  - {alias} ({skill.original_name})")
    
    print("\n--- Skill Index ---")
    print(build_skill_index(skills))
