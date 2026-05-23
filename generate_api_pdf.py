#!/usr/bin/env python3
"""Generate SARPO API Documentation PDF using ReportLab."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# ━━ Color Palette (auto-generated) ━━
ACCENT       = colors.HexColor('#1e7694')
TEXT_PRIMARY  = colors.HexColor('#222425')
TEXT_MUTED    = colors.HexColor('#838a8f')
BG_SURFACE   = colors.HexColor('#d4dade')
BG_PAGE      = colors.HexColor('#ebeef0')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# ━━ Font Registration ━━
pdfmetrics.registerFont(TTFont('DejaVuSerif', '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSerif-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuMono', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuMono-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'))

registerFontFamily('DejaVuSerif', normal='DejaVuSerif', bold='DejaVuSerif-Bold')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')
registerFontFamily('DejaVuMono', normal='DejaVuMono', bold='DejaVuMono-Bold')

# ━━ Page Setup ━━
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 1.0 * inch
RIGHT_MARGIN = 1.0 * inch
TOP_MARGIN = 0.8 * inch
BOTTOM_MARGIN = 0.8 * inch
AVAILABLE_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

OUTPUT_PATH = '/home/z/my-project/sarpo_api_documentation.pdf'

# ━━ Styles ━━
title_style = ParagraphStyle(
    name='DocTitle', fontName='DejaVuSerif', fontSize=28,
    leading=34, textColor=ACCENT, alignment=TA_LEFT, spaceAfter=6
)
subtitle_style = ParagraphStyle(
    name='DocSubtitle', fontName='DejaVuSerif', fontSize=14,
    leading=20, textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=24
)
h1_style = ParagraphStyle(
    name='H1', fontName='DejaVuSerif', fontSize=20,
    leading=26, textColor=ACCENT, spaceBefore=24, spaceAfter=12
)
h2_style = ParagraphStyle(
    name='H2', fontName='DejaVuSerif', fontSize=15,
    leading=20, textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=8
)
h3_style = ParagraphStyle(
    name='H3', fontName='DejaVuSerif', fontSize=12,
    leading=16, textColor=ACCENT, spaceBefore=12, spaceAfter=6
)
body_style = ParagraphStyle(
    name='Body', fontName='DejaVuSerif', fontSize=10.5,
    leading=17, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=6
)
code_style = ParagraphStyle(
    name='Code', fontName='DejaVuMono', fontSize=9,
    leading=14, textColor=colors.HexColor('#c7254e'),
    backColor=colors.HexColor('#f9f2f4'), spaceAfter=6,
    leftIndent=12, rightIndent=12, spaceBefore=4
)
muted_style = ParagraphStyle(
    name='Muted', fontName='DejaVuSerif', fontSize=9.5,
    leading=15, textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=4
)
table_header_style = ParagraphStyle(
    name='TH', fontName='DejaVuSerif', fontSize=10,
    leading=14, textColor=TABLE_HEADER_TEXT, alignment=TA_CENTER
)
table_cell_style = ParagraphStyle(
    name='TC', fontName='DejaVuSerif', fontSize=9.5,
    leading=14, textColor=TEXT_PRIMARY, alignment=TA_LEFT
)
table_cell_center = ParagraphStyle(
    name='TCC', fontName='DejaVuSerif', fontSize=9.5,
    leading=14, textColor=TEXT_PRIMARY, alignment=TA_CENTER
)
table_code_style = ParagraphStyle(
    name='TCode', fontName='DejaVuMono', fontSize=8.5,
    leading=13, textColor=colors.HexColor('#c7254e'), alignment=TA_LEFT
)

# ━━ Helper Functions ━━
def make_heading(text, style, bookmark=None):
    p = Paragraph(f'<b>{text}</b>', style)
    if bookmark:
        p.bookmark_name = bookmark
    return p

def make_method_badge(method):
    color_map = {
        'GET': colors.HexColor('#61affe'),
        'POST': colors.HexColor('#49cc90'),
        'PUT': colors.HexColor('#fca130'),
        'DELETE': colors.HexColor('#f93e3e'),
    }
    bg = color_map.get(method, ACCENT)
    return Paragraph(f'<b>{method}</b>', ParagraphStyle(
        name=f'Badge_{method}', fontName='DejaVuMono', fontSize=8.5,
        leading=13, textColor=colors.white, alignment=TA_CENTER
    ))

def make_endpoint_table(method, path, description, query_params=None, request_body=None, response_example=None):
    """Build a complete API endpoint section."""
    elements = []
    
    # Method + Path header
    method_p = make_method_badge(method)
    path_p = Paragraph(f'<b>{path}</b>', ParagraphStyle(
        name='EndpointPath', fontName='DejaVuMono', fontSize=11,
        leading=16, textColor=TEXT_PRIMARY, alignment=TA_LEFT
    ))
    desc_p = Paragraph(description, ParagraphStyle(
        name='EndpointDesc', fontName='DejaVuSerif', fontSize=10,
        leading=15, textColor=TEXT_MUTED, alignment=TA_LEFT
    ))
    
    # Method + Path + Description in a small table
    header_data = [[method_p, path_p]]
    header_table = Table(header_data, colWidths=[50, AVAILABLE_W - 50])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('BACKGROUND', (0, 0), (0, 0), {
            'GET': colors.HexColor('#61affe'),
            'POST': colors.HexColor('#49cc90'),
            'PUT': colors.HexColor('#fca130'),
            'DELETE': colors.HexColor('#f93e3e'),
        }.get(method, ACCENT)),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    elements.append(header_table)
    elements.append(desc_p)
    
    # Query Parameters
    if query_params:
        elements.append(Spacer(1, 8))
        elements.append(Paragraph('<b>Query Parameters</b>', h3_style))
        param_data = [
            [Paragraph('<b>Parameter</b>', table_header_style),
             Paragraph('<b>Type</b>', table_header_style),
             Paragraph('<b>Required</b>', table_header_style),
             Paragraph('<b>Description</b>', table_header_style)]
        ]
        for i, p in enumerate(query_params):
            param_data.append([
                Paragraph(p[0], table_code_style),
                Paragraph(p[1], table_cell_center),
                Paragraph(p[2], table_cell_center),
                Paragraph(p[3], table_cell_style)
            ])
        param_table = Table(param_data, colWidths=[0.22*AVAILABLE_W, 0.12*AVAILABLE_W, 0.12*AVAILABLE_W, 0.54*AVAILABLE_W])
        style_cmds = [
            ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
            ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
            ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]
        for i in range(1, len(param_data)):
            bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
        param_table.setStyle(TableStyle(style_cmds))
        param_table.hAlign = 'CENTER'
        elements.append(param_table)
    
    # Request Body
    if request_body:
        elements.append(Spacer(1, 8))
        elements.append(Paragraph('<b>Request Body</b>', h3_style))
        elements.append(Paragraph(request_body, code_style))
    
    # Response Example
    if response_example:
        elements.append(Spacer(1, 8))
        elements.append(Paragraph('<b>Response</b>', h3_style))
        elements.append(Paragraph(response_example, code_style))
    
    elements.append(Spacer(1, 12))
    elements.append(HRFlowable(width='100%', thickness=0.5, color=TEXT_MUTED, spaceAfter=12))
    
    return elements

# ━━ Build Document ━━
doc = SimpleDocTemplate(
    OUTPUT_PATH, pagesize=A4,
    leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
    title='SARPO API Documentation',
    author='SARPO',
    creator='Z.ai'
)

story = []

# ━━ Title Page ━━
story.append(Spacer(1, 80))
story.append(Paragraph('<b>SARPO</b>', title_style))
story.append(Spacer(1, 8))
story.append(Paragraph('API Documentation', ParagraphStyle(
    name='BigSubtitle', fontName='DejaVuSerif', fontSize=22,
    leading=28, textColor=TEXT_PRIMARY, alignment=TA_LEFT
)))
story.append(Spacer(1, 16))
story.append(HRFlowable(width='40%', thickness=2, color=ACCENT, spaceAfter=16))
story.append(Paragraph('REST API specification for the SARPO e-commerce platform.', body_style))
story.append(Paragraph('Base URL: https://api.sarpo.uz/api', code_style))
story.append(Spacer(1, 24))
story.append(Paragraph('Version 1.0 | March 2026', muted_style))
story.append(PageBreak())

# ━━ Table of Contents (manual) ━━
story.append(Paragraph('<b>Contents</b>', h1_style))
story.append(Spacer(1, 12))

toc_items = [
    ('1. Overview', ''),
    ('2. Products', ''),
    ('   2.1 GET /products', ''),
    ('   2.2 GET /products/:id', ''),
    ('   2.3 GET /products/recommended', ''),
    ('   2.4 GET /products/new', ''),
    ('3. Collections', ''),
    ('4. Hero Slides', ''),
    ('5. Cart (Server-side)', ''),
    ('6. Orders', ''),
    ('7. Contact', ''),
    ('8. API Summary Table', ''),
]
for item, _ in toc_items:
    indent = 24 if item.startswith('   ') else 0
    story.append(Paragraph(item.strip(), ParagraphStyle(
        name=f'TOC_{item.strip()}', fontName='DejaVuSerif', fontSize=11,
        leading=18, textColor=ACCENT if not item.startswith('   ') else TEXT_PRIMARY,
        leftIndent=indent, spaceAfter=3
    )))
story.append(PageBreak())

# ━━ 1. Overview ━━
story.append(make_heading('1. Overview', h1_style))
story.append(Paragraph(
    'This document describes the REST API endpoints required for the SARPO e-commerce frontend application. '
    'The API follows standard REST conventions, uses JSON for request/response bodies, and supports filtering, '
    'sorting, and pagination for product listings.',
    body_style
))
story.append(Spacer(1, 8))
story.append(Paragraph('<b>Base URL</b>', h3_style))
story.append(Paragraph('https://api.sarpo.uz/api', code_style))
story.append(Spacer(1, 8))
story.append(Paragraph('<b>Authentication</b>', h3_style))
story.append(Paragraph(
    'All endpoints requiring authentication should use Bearer token authentication via the Authorization header: '
    '<font name="DejaVuSans" size="9">Authorization: Bearer &lt;token&gt;</font>',
    body_style
))
story.append(Spacer(1, 8))
story.append(Paragraph('<b>Response Format</b>', h3_style))
story.append(Paragraph('All responses are in JSON format. Successful responses return HTTP 2xx status codes. '
    'Error responses include an error object with message and code fields.', body_style))
story.append(Spacer(1, 6))

# ━━ 2. Products ━━
story.append(make_heading('2. Products', h1_style))
story.append(Paragraph('Endpoints for managing and retrieving product information.', body_style))

# 2.1 GET /products
story.extend(make_endpoint_table(
    'GET', '/products', 'Retrieve a paginated list of products with filtering, sorting, and search capabilities.',
    query_params=[
        ('search', 'string', 'No', 'Search by product name (partial match)'),
        ('collection', 'string', 'No', 'Filter by collection. Values: Весенняя коллекция, Летняя коллекция, Осенняя коллекция, Зимняя коллекция. Multiple values comma-separated.'),
        ('isNew', 'boolean', 'No', 'Filter products marked as new (Новинки)'),
        ('category', 'string', 'No', 'Filter by product category'),
        ('priceMin', 'number', 'No', 'Minimum price filter (default: 0)'),
        ('priceMax', 'number', 'No', 'Maximum price filter (default: no limit)'),
        ('sort', 'string', 'No', 'Sort order: newest, price-asc, price-desc, popular'),
        ('page', 'number', 'No', 'Page number (default: 1)'),
        ('limit', 'number', 'No', 'Items per page (default: 20)'),
    ],
    response_example='''{
  "products": [
    {
      "id": "1",
      "name": "Cable Knit Jumper Dress",
      "price": 35.99,
      "image": "/images/ai-generated/product_blue_grey.jpg",
      "images": ["/images/...1.jpg", "/images/...2.jpg"],
      "category": "Women's Tops",
      "collection": "Осенняя коллекция",
      "isNew": true,
      "description": "Product description..."
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20
}'''
))

# 2.2 GET /products/:id
story.extend(make_endpoint_table(
    'GET', '/products/:id', 'Retrieve a single product by its unique identifier.',
    response_example='''{
  "id": "1",
  "name": "Cable Knit Jumper Dress",
  "price": 35.99,
  "image": "/images/ai-generated/product_blue_grey.jpg",
  "images": ["/images/...1.jpg", "/images/...2.jpg", "/images/...3.jpg"],
  "category": "Women's Tops",
  "collection": "Осенняя коллекция",
  "isNew": true,
  "description": "Full product description..."
}'''
))

# 2.3 GET /products/recommended
story.extend(make_endpoint_table(
    'GET', '/products/recommended', 'Get recommended products for the homepage display.',
    query_params=[
        ('limit', 'number', 'No', 'Number of products to return (default: 10)'),
        ('excludeId', 'string', 'No', 'Exclude a specific product ID (for product detail page)'),
    ]
))

# 2.4 GET /products/new
story.extend(make_endpoint_table(
    'GET', '/products/new', 'Get new arrivals (products with isNew=true) for the Новинки section on the homepage.',
    query_params=[
        ('limit', 'number', 'No', 'Number of products to return (default: 10)'),
    ]
))

# ━━ 3. Collections ━━
story.append(make_heading('3. Collections', h1_style))
story.append(Paragraph('Retrieve available product collections for navigation and filtering.', body_style))
story.extend(make_endpoint_table(
    'GET', '/collections', 'Get the list of all available product collections.',
    response_example='''[
  { "id": "1", "name": "Весенняя коллекция", "slug": "vesennyaya" },
  { "id": "2", "name": "Летняя коллекция", "slug": "letnyaya" },
  { "id": "3", "name": "Осенняя коллекция", "slug": "osennyaya" },
  { "id": "4", "name": "Зимняя коллекция", "slug": "zimnyaya" },
  { "id": "5", "name": "Новинки", "slug": "novinki" }
]'''
))

# ━━ 4. Hero Slides ━━
story.append(make_heading('4. Hero Slides', h1_style))
story.append(Paragraph('Slides for the homepage hero carousel.', body_style))
story.extend(make_endpoint_table(
    'GET', '/hero-slides', 'Get all hero slides for the homepage carousel.',
    response_example='''[
  {
    "id": "1",
    "image": "/images/hero_three_women.jpg",
    "title": "SARPO - Baxt ulashamiz!",
    "subtitle": "Toshkent bo'ylab keng tarmoqli...",
    "order": 1
  }
]'''
))

# ━━ 5. Cart (Server-side) ━━
story.append(make_heading('5. Cart (Server-side, Optional)', h1_style))
story.append(Paragraph(
    'These endpoints are optional. The frontend currently stores cart state on the client side (Zustand). '
    'Server-side cart storage enables cross-device persistence and session recovery.',
    body_style
))

story.extend(make_endpoint_table(
    'GET', '/cart', 'Get the current user\'s cart contents.'
))
story.extend(make_endpoint_table(
    'POST', '/cart/items', 'Add a product to the cart.',
    request_body='''{
  "productId": "1",
  "quantity": 2
}'''
))
story.extend(make_endpoint_table(
    'PUT', '/cart/items/:productId', 'Update the quantity of a cart item.',
    request_body='''{
  "quantity": 3
}'''
))
story.extend(make_endpoint_table(
    'DELETE', '/cart/items/:productId', 'Remove a product from the cart.'
))
story.extend(make_endpoint_table(
    'DELETE', '/cart', 'Clear all items from the cart.'
))

# ━━ 6. Orders ━━
story.append(make_heading('6. Orders', h1_style))
story.append(Paragraph('Create and manage customer orders.', body_style))
story.extend(make_endpoint_table(
    'POST', '/orders', 'Create a new order from the cart contents.',
    request_body='''{
  "customer": {
    "name": "Ivan Ivanov",
    "phone": "+998901234567",
    "address": "Tashkent, Amir Temur 1"
  },
  "items": [
    { "productId": "1", "quantity": 2 },
    { "productId": "5", "quantity": 1 }
  ],
  "paymentMethod": "payme",
  "totalPrice": 101.98
}''',
    response_example='''{
  "orderId": "ORD-20260301-001",
  "status": "created",
  "paymentUrl": "https://payme.uz/checkout/...",
  "totalPrice": 101.98
}'''
))
story.append(Spacer(1, 6))
story.append(Paragraph('<b>Payment Method Values:</b> payme, uzum, click', body_style))

# ━━ 7. Contact ━━
story.append(make_heading('7. Contact', h1_style))
story.append(Paragraph('Contact form for reaching the operator.', body_style))
story.extend(make_endpoint_table(
    'POST', '/contact', 'Submit a contact request to reach an operator.',
    request_body='''{
  "name": "Ivan Ivanov",
  "phone": "+998901234567",
  "message": "I want to check product availability..."
}''',
    response_example='''{
  "success": true,
  "message": "Your request has been sent. An operator will contact you shortly."
}'''
))

# ━━ 8. Summary Table ━━
story.append(make_heading('8. API Summary Table', h1_style))
story.append(Spacer(1, 6))

summary_data = [
    [Paragraph('<b>#</b>', table_header_style),
     Paragraph('<b>Method</b>', table_header_style),
     Paragraph('<b>Endpoint</b>', table_header_style),
     Paragraph('<b>Description</b>', table_header_style),
     Paragraph('<b>Required</b>', table_header_style)],
]

endpoints = [
    ('1', 'GET', '/products', 'List products (filter, search, sort)', 'Yes'),
    ('2', 'GET', '/products/:id', 'Get single product', 'Yes'),
    ('3', 'GET', '/products/recommended', 'Recommended products', 'Yes'),
    ('4', 'GET', '/products/new', 'New arrivals (Новинки)', 'Yes'),
    ('5', 'GET', '/collections', 'List collections', 'Yes'),
    ('6', 'GET', '/hero-slides', 'Hero carousel slides', 'Yes'),
    ('7', 'GET', '/cart', 'Get cart contents', 'No'),
    ('8', 'POST', '/cart/items', 'Add to cart', 'No'),
    ('9', 'PUT', '/cart/items/:productId', 'Update cart quantity', 'No'),
    ('10', 'DELETE', '/cart/items/:productId', 'Remove from cart', 'No'),
    ('11', 'DELETE', '/cart', 'Clear cart', 'No'),
    ('12', 'POST', '/orders', 'Create order', 'Yes'),
    ('13', 'POST', '/contact', 'Contact operator', 'Recommended'),
]

for i, (num, method, endpoint, desc, required) in enumerate(endpoints):
    summary_data.append([
        Paragraph(num, table_cell_center),
        Paragraph(f'<b>{method}</b>', ParagraphStyle(
            name=f'SumBadge_{i}', fontName='DejaVuMono', fontSize=8,
            leading=12, textColor={
                'GET': colors.HexColor('#0d6efd'),
                'POST': colors.HexColor('#198754'),
                'PUT': colors.HexColor('#fd7e14'),
                'DELETE': colors.HexColor('#dc3545'),
            }.get(method, TEXT_PRIMARY), alignment=TA_CENTER
        )),
        Paragraph(endpoint, table_code_style),
        Paragraph(desc, table_cell_style),
        Paragraph(required, table_cell_center),
    ])

summary_table = Table(summary_data, colWidths=[0.06*AVAILABLE_W, 0.10*AVAILABLE_W, 0.32*AVAILABLE_W, 0.36*AVAILABLE_W, 0.16*AVAILABLE_W])
style_cmds = [
    ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
    ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
    ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]
for i in range(1, len(summary_data)):
    bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
    style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
summary_table.setStyle(TableStyle(style_cmds))
summary_table.hAlign = 'CENTER'
story.append(summary_table)

story.append(Spacer(1, 18))
story.append(Paragraph('<b>Legend:</b>', body_style))
story.append(Paragraph('Required = Minimum endpoints needed for frontend to function', muted_style))
story.append(Paragraph('No = Optional (cart is stored client-side by default)', muted_style))
story.append(Paragraph('Recommended = Should implement for better UX', muted_style))

# ━━ Build PDF ━━
doc.build(story)
print(f'PDF generated: {OUTPUT_PATH}')
