/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = globalThis, e$4 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$4 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$4) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$4 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$3, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ??= []).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$3(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2?.call(this);
      r2?.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t2) => t2(this));
  }
  addController(t2) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t2), void 0 !== this.renderRoot && this.isConnected && t2.hostConnected?.();
  }
  removeController(t2) {
    this._$EO?.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t2) => t2.hostConnected?.());
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t2) => t2.hostDisconnected?.());
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== i2.converter?.toAttribute ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== t3.converter?.fromAttribute ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? this._$Ej?.get(e2) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ??= r2.getPropertyOptions(t2), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === this._$Ej?.get(t2) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), this._$EO?.forEach((t3) => t3.hostUpdate?.()), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    this._$EO?.forEach((t3) => t3.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq &&= this._$Eq.forEach((t3) => this._$ET(t3, this[t3])), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = (t2) => t2, s$1 = t$1.trustedTypes, e$2 = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof t2?.[Symbol.iterator], f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), w = x(2), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e$2 ? e$2.createHTML(i2) : i2;
}
const N = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i2, s2 = t2, e2) {
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? s2._$Co?.[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return h2?.constructor !== o2 && (h2?._$AO?.(false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ??= [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = (t2?.creationScope ?? l).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== r2?.index && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = e2?.isConnected ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === t2?.nodeType && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (this._$AH?._$AD === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    for (this._$AP?.(false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    void 0 === this._$AM && (this._$Cv = t2, this._$AP?.(t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 ||= !a(r2) || r2 !== this._$AH[n3], r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B?.(S, k), (t$1.litHtmlVersions ??= []).push("3.3.3");
const D = (t2, i2, s2) => {
  const e2 = s2?.renderBefore ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = s2?.renderBefore ?? null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t2 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t2.firstChild, t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, s.litElementHydrateSupport?.({ LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1?.({ LitElement: i });
(s.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1 = (e2, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c2), c2);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e(e2, r2) {
  return (n3, s2, i2) => {
    const o2 = (t2) => t2.renderRoot?.querySelector(e2) ?? null;
    return e$1(n3, s2, { get() {
      return o2(this);
    } });
  };
}
const DEFAULT_CONFIG = {
  theme: "linen",
  household_name: "Zuhause",
  rooms: {},
  overview: {
    presence: [],
    scenes: [],
    cameras: [],
    camera_motion: {},
    energy: {},
    events: { appliances: [], waste_calendar: void 0, low_battery_threshold: 10, battery_entities: [] },
    radios: []
  }
};
class ConfigStore {
  constructor() {
    this._config = DEFAULT_CONFIG;
    this._listeners = /* @__PURE__ */ new Set();
    this._pendingSave = null;
    this._bound = false;
  }
  get config() {
    return this._config;
  }
  attach(hass) {
    const withConn = hass;
    if (this._hass === withConn) return;
    this._hass = withConn;
    if (this._bound) return;
    this._bound = true;
    this._subscribe();
  }
  detach() {
    if (this._unsub) {
      this._unsub();
      this._unsub = void 0;
    }
    this._bound = false;
  }
  subscribe(listener) {
    this._listeners.add(listener);
    listener(this._config);
    return () => {
      this._listeners.delete(listener);
    };
  }
  update(patch) {
    const next = typeof patch === "function" ? patch(this._config) : { ...this._config, ...patch };
    this._config = next;
    this._emit();
    this._scheduleSave();
  }
  set(config) {
    this._config = config;
    this._emit();
    this._scheduleSave();
  }
  _emit() {
    this._listeners.forEach((cb) => {
      try {
        cb(this._config);
      } catch (e2) {
        console.error("[lindenweg] listener threw", e2);
      }
    });
  }
  _scheduleSave() {
    if (this._pendingSave !== null) {
      window.clearTimeout(this._pendingSave);
    }
    this._pendingSave = window.setTimeout(() => {
      this._pendingSave = null;
      void this._flush();
    }, 350);
  }
  async _flush() {
    if (!this._hass) return;
    try {
      await this._hass.connection.sendMessagePromise({
        type: "lindenweg/config/set",
        config: this._config
      });
    } catch (e2) {
      console.error("[lindenweg] config save failed", e2);
    }
  }
  async _subscribe() {
    if (!this._hass) return;
    try {
      this._unsub = await this._hass.connection.subscribeMessage(
        (event) => {
          if (!event || !event.config) return;
          const incoming = JSON.stringify(event.config);
          const current = JSON.stringify(this._config);
          if (incoming !== current) {
            this._config = event.config;
            this._emit();
          }
        },
        { type: "lindenweg/config/subscribe" }
      );
    } catch (e2) {
      console.warn("[lindenweg] config subscribe failed — backend integration not installed?", e2);
    }
  }
}
const configStore = new ConfigStore();
const themeLinen = i$3`
  :host([theme='linen']),
  .theme-linen {
    --bg: #ece6da;
    --bg-soft: #f3eee3;
    --card: #fbf7ee;
    --card-elev: #ffffff;
    --card-inset: #ebe5d8;
    --border: #ddd5c2;
    --border-soft: #e6dfcf;
    --border-strong: #c7bea8;
    --text: #2a2620;
    --text-muted: #8a8278;
    --text-faint: #b8b1a4;
    --accent: #7e8f70;
    --accent-soft: #c9d2bc;
    --warn: #c47556;
    --warn-soft: #ecc9b8;
    --amber: #d9a25a;
    --amber-soft: #efd9b3;
    --blue: #6e8a9e;
    --blue-soft: #bdcfd9;
    --shadow-sm: 0 1px 2px rgba(40, 30, 20, 0.05);
    --shadow: 0 2px 10px rgba(40, 30, 20, 0.06), 0 1px 2px rgba(40, 30, 20, 0.03);
    --shadow-lg: 0 8px 30px rgba(40, 30, 20, 0.08);
    --grid: rgba(40, 30, 20, 0.04);
    --on-glow: 0 0 24px rgba(217, 162, 90, 0.45);
    --hover-bg: rgba(40, 30, 20, 0.04);
  }
`;
const themeWalnut = i$3`
  :host([theme='walnut']),
  .theme-walnut {
    --bg: #1a1612;
    --bg-soft: #221d18;
    --card: #2a241e;
    --card-elev: #322b24;
    --card-inset: #1e1915;
    --border: #3a3229;
    --border-soft: #2f2922;
    --border-strong: #4d4238;
    --text: #ede5d4;
    --text-muted: #968c7d;
    --text-faint: #5a5247;
    --accent: #a3b58c;
    --accent-soft: #3b4636;
    --warn: #d88366;
    --warn-soft: #523429;
    --amber: #e8b576;
    --amber-soft: #4a3a24;
    --blue: #9ab5c4;
    --blue-soft: #2d3a44;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
    --grid: rgba(255, 240, 210, 0.04);
    --on-glow: 0 0 28px rgba(232, 181, 118, 0.35);
    --hover-bg: rgba(255, 240, 210, 0.04);
  }
`;
const baseStyles = i$3`
  :host {
    font-family: 'Geist', system-ui, -apple-system, sans-serif;
    color: var(--text);
    font-feature-settings: 'ss01', 'cv11';
    letter-spacing: -0.005em;
    -webkit-font-smoothing: antialiased;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button {
    font: inherit;
    cursor: pointer;
  }

  .mono {
    font-family: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
    font-feature-settings: 'tnum';
  }

  .card {
    background: var(--card);
    border-radius: 18px;
    border: 1px solid var(--border-soft);
    padding: 16px;
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 0;
  }
  .card.elev {
    background: var(--card-elev);
    box-shadow: var(--shadow);
  }

  .card-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }
  .card-sub {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-faint);
  }
  .card-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin-top: 2px;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 500;
    border-radius: 999px;
    line-height: 1.2;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 12.5px;
    font-weight: 500;
  }
  .btn-ghost:hover {
    background: var(--card);
  }

  .dot-status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    background: var(--accent);
  }

  .divider {
    height: 1px;
    background: var(--border-soft);
  }

  @keyframes pulse-soft {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.55;
    }
  }
  .pulse {
    animation: pulse-soft 2.4s ease-in-out infinite;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .rise {
    animation: rise 0.35s ease-out both;
  }
`;
let injected = false;
function injectFontImport() {
  if (injected) return;
  injected = true;
  if (typeof document === "undefined") return;
  if (document.getElementById("lindenweg-fonts")) return;
  const link = document.createElement("link");
  link.id = "lindenweg-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}
const isOn = (state) => state === "on" || state === "open" || state === "playing" || state === "unlocked" || state === "home";
const entityState = (hass, id) => {
  if (!hass || !id) return void 0;
  return hass.states[id];
};
const stateNum = (e2, fallback = 0) => {
  if (!e2) return fallback;
  const n3 = parseFloat(e2.state);
  return Number.isFinite(n3) ? n3 : fallback;
};
const attrNum = (e2, attr, fallback = 0) => {
  if (!e2) return fallback;
  const v2 = e2.attributes?.[attr];
  const n3 = typeof v2 === "number" ? v2 : parseFloat(v2);
  return Number.isFinite(n3) ? n3 : fallback;
};
const brightnessPct = (e2) => {
  if (!e2 || e2.state !== "on") return 0;
  const b2 = e2.attributes?.brightness;
  if (typeof b2 !== "number") return 100;
  return Math.round(b2 / 255 * 100);
};
const friendlyName = (e2, fallback = "") => e2?.attributes?.friendly_name || fallback || e2?.entity_id || "";
const callLightTurnOn = (hass, entity_id, brightness_pct) => {
  const data = {};
  if (brightness_pct !== void 0) data.brightness_pct = brightness_pct;
  void hass.callService("light", "turn_on", data, { entity_id });
};
const callLightTurnOff = (hass, entity_id) => {
  void hass.callService("light", "turn_off", {}, { entity_id });
};
const callToggle = (hass, entity_id) => {
  const domain = entity_id.split(".")[0];
  void hass.callService(domain, "toggle", {}, { entity_id });
};
const callCoverSetPosition = (hass, entity_id, position) => {
  void hass.callService("cover", "set_cover_position", { position }, { entity_id });
};
const callClimateSetTemp = (hass, entity_id, temperature) => {
  void hass.callService("climate", "set_temperature", { temperature }, { entity_id });
};
const callMediaPlay = (hass, entity_id, play) => {
  void hass.callService("media_player", play ? "media_play" : "media_pause", {}, { entity_id });
};
const callMediaVolume = (hass, entity_id, volume) => {
  void hass.callService("media_player", "volume_set", { volume_level: volume / 100 }, { entity_id });
};
const callSceneActivate = (hass, entity_id) => {
  void hass.callService("scene", "turn_on", {}, { entity_id });
};
var __defProp$z = Object.defineProperty;
var __getOwnPropDesc$z = Object.getOwnPropertyDescriptor;
var __decorateClass$z = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$z(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$z(target, key, result);
  return result;
};
const ICONS = {
  home: () => w`<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>`,
  sofa: () => w`<path d="M3 14v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/><path d="M3 14h18v4H3z"/><path d="M5 18v2M19 18v2"/>`,
  kettle: () => w`<path d="M6 9h12l-1 11H7L6 9z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M18 12h2v3h-2"/>`,
  bed: () => w`<path d="M3 18V8M21 18v-5H3"/><path d="M21 13V8a2 2 0 0 0-2-2h-7v7"/><circle cx="7" cy="11" r="1.5"/>`,
  shower: () => w`<path d="M8 4a4 4 0 0 1 8 0v3"/><path d="M5 9h14l-1 2H6z"/><path d="M9 13v2M12 14v2M15 13v2M9 17v2M12 18v2M15 17v2"/>`,
  desk: () => w`<path d="M3 8h18M5 8v12M19 8v12M3 8l2-3h14l2 3"/><path d="M8 14h8"/>`,
  chair: () => w`<path d="M6 4h12v9H6z"/><path d="M5 13h14M8 13v7M16 13v7"/>`,
  door: () => w`<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="15" cy="12" r=".8" fill="currentColor"/>`,
  tree: () => w`<path d="M12 3c-3 2-5 5-5 8a5 5 0 0 0 10 0c0-3-2-6-5-8z"/><path d="M12 14v7M9 18h6"/>`,
  cog: () => w`<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>`,
  sun: () => w`<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>`,
  moon: () => w`<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>`,
  "partly-cloudy": () => w`<circle cx="8" cy="10" r="3"/><path d="M11 14a4 4 0 1 1 4 4H7a3 3 0 0 1 0-6"/>`,
  cloud: () => w`<path d="M7 18a4 4 0 0 1-1-7.9A6 6 0 0 1 18 11a3.5 3.5 0 0 1-.5 7H7z"/>`,
  rain: () => w`<path d="M7 15a4 4 0 0 1-1-7.9A6 6 0 0 1 18 8a3.5 3.5 0 0 1-.5 7H7z"/><path d="M9 18l-1 2M13 18l-1 2M17 18l-1 2"/>`,
  film: () => w`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M3 14h4M17 9h4M17 14h4"/>`,
  book: () => w`<path d="M4 4h7v16H6a2 2 0 0 1-2-2V4z"/><path d="M20 4h-7v16h5a2 2 0 0 0 2-2V4z"/>`,
  lock: () => w`<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  unlock: () => w`<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>`,
  shield: () => w`<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/>`,
  "shield-check": () => w`<path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="M9 12l2 2 4-4"/>`,
  bell: () => w`<path d="M6 16V10a6 6 0 0 1 12 0v6l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/>`,
  camera: () => w`<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 7l1.5-2h3L15 7"/>`,
  play: () => w`<path d="M7 5l12 7-12 7V5z" fill="currentColor"/>`,
  pause: () => w`<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>`,
  "skip-next": () => w`<path d="M6 5l9 7-9 7V5z" fill="currentColor" stroke="none"/><path d="M17 5v14"/>`,
  "skip-prev": () => w`<path d="M18 5l-9 7 9 7V5z" fill="currentColor" stroke="none"/><path d="M7 5v14"/>`,
  volume: () => w`<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a5 5 0 0 1 0 8"/>`,
  bolt: () => w`<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z"/>`,
  leaf: () => w`<path d="M5 19c0-9 5-14 14-14 0 9-5 14-14 14z"/><path d="M5 19c4-4 7-8 14-14"/>`,
  wifi: () => w`<path d="M5 12a10 10 0 0 1 14 0"/><path d="M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/>`,
  thermometer: () => w`<path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/>`,
  droplet: () => w`<path d="M12 3s6 6 6 11a6 6 0 1 1-12 0c0-5 6-11 6-11z"/>`,
  fan: () => w`<circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 10c0-3-1-6 1-7s3 2 3 4-2 3-4 3"/><path d="M14 12c3 0 6-1 7 1s-2 3-4 3-3-2-3-4"/><path d="M12 14c0 3 1 6-1 7s-3-2-3-4 2-3 4-3"/><path d="M10 12c-3 0-6 1-7-1s2-3 4-3 3 2 3 4"/>`,
  lightbulb: () => w`<path d="M9 18h6"/><path d="M10 21h4"/><path d="M9 15a5 5 0 1 1 6 0v2H9v-2z"/>`,
  blinds: () => w`<rect x="4" y="4" width="16" height="14" rx="1"/><path d="M4 8h16M4 11h16M4 14h16"/><path d="M12 18v3"/>`,
  tv: () => w`<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 17v3"/>`,
  music: () => w`<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>`,
  mic: () => w`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  package: () => w`<path d="M12 3 4 7v10l8 4 8-4V7l-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>`,
  plant: () => w`<path d="M12 21V10"/><path d="M12 14c-4 0-6-3-6-7 4 0 6 3 6 7z"/><path d="M12 12c4 0 6-2 6-5-4 0-6 2-6 5z"/><path d="M8 21h8"/>`,
  water: () => w`<path d="M12 4c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>`,
  fire: () => w`<path d="M12 3c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>`,
  "arrow-right": () => w`<path d="M5 12h14M13 6l6 6-6 6"/>`,
  "arrow-down": () => w`<path d="M12 5v14M6 13l6 6 6-6"/>`,
  "arrow-up": () => w`<path d="M12 19V5M6 11l6-6 6 6"/>`,
  plus: () => w`<path d="M12 5v14M5 12h14"/>`,
  minus: () => w`<path d="M5 12h14"/>`,
  check: () => w`<path d="M5 12l5 5 9-10"/>`,
  x: () => w`<path d="M6 6l12 12M18 6 6 18"/>`,
  wind: () => w`<path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 14h17a3 3 0 1 1-3 3"/>`,
  eye: () => w`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  calendar: () => w`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
  clock: () => w`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  vacuum: () => w`<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="2.5"/><path d="M12 6V3M9 3h6"/>`,
  washer: () => w`<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="14" r="5"/><circle cx="9" cy="6" r=".7" fill="currentColor"/><circle cx="11" cy="6" r=".7" fill="currentColor"/>`,
  garage: () => w`<path d="M3 20V10l9-5 9 5v10"/><rect x="6" y="12" width="12" height="8"/><path d="M6 16h12"/>`,
  menu: () => w`<path d="M4 7h16M4 12h16M4 17h16"/>`,
  more: () => w`<circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/>`,
  oven: () => w`<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 10h16"/><circle cx="8" cy="7" r=".8" fill="currentColor"/><circle cx="12" cy="7" r=".8" fill="currentColor"/><circle cx="16" cy="7" r=".8" fill="currentColor"/><path d="M9 16h6"/>`,
  fridge: () => w`<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 10h14M8 6v2M8 13v3"/>`,
  printer: () => w`<path d="M7 8V4h10v4"/><rect x="3" y="8" width="18" height="9" rx="1.5"/><rect x="7" y="14" width="10" height="6"/>`,
  monitor: () => w`<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M9 20h6M12 17v3"/>`,
  sound: () => w`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>`,
  tag: () => w`<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/>`,
  sparkle: () => w`<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>`,
  phone: () => w`<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 7a2 2 0 0 1 1-3z"/>`,
  gear: () => w`<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>`,
  sliders: () => w`<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>`,
  meeting: () => w`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`
};
let LwIcon = class extends i {
  constructor() {
    super(...arguments);
    this.name = "cog";
    this.size = 18;
    this.stroke = 1.6;
  }
  render() {
    const renderer = ICONS[this.name] || (() => w`<circle cx="12" cy="12" r="6"/>`);
    return b`
      <svg
        width=${this.size}
        height=${this.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width=${this.stroke}
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        ${renderer()}
      </svg>
    `;
  }
};
LwIcon.styles = i$3`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
    }
    svg {
      display: block;
    }
  `;
__decorateClass$z([
  n2({ type: String })
], LwIcon.prototype, "name", 2);
__decorateClass$z([
  n2({ type: Number })
], LwIcon.prototype, "size", 2);
__decorateClass$z([
  n2({ type: Number })
], LwIcon.prototype, "stroke", 2);
LwIcon = __decorateClass$z([
  t("lw-icon")
], LwIcon);
var __defProp$y = Object.defineProperty;
var __getOwnPropDesc$y = Object.getOwnPropertyDescriptor;
var __decorateClass$y = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$y(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$y(target, key, result);
  return result;
};
let LwSidebar = class extends i {
  constructor() {
    super(...arguments);
    this.page = "overview";
  }
  _go(page) {
    this.dispatchEvent(
      new CustomEvent("navigate", { detail: { page }, bubbles: true, composed: true })
    );
  }
  _onCount(room) {
    if (!this.hass || !room.lights?.length) return 0;
    return room.lights.filter((id) => isOn(this.hass.states[id]?.state ?? "off")).length;
  }
  _presenceCount() {
    const persons = this.config.overview?.presence ?? [];
    if (!this.hass) return { home: 0, total: persons.length };
    let home = 0;
    persons.forEach((p2) => {
      if (this.hass.states[p2]?.state === "home") home++;
    });
    return { home, total: persons.length };
  }
  _weather() {
    const w2 = entityState(this.hass, this.config.overview?.weather);
    if (!w2) return null;
    return {
      temp: Math.round(attrNum(w2, "temperature", NaN)),
      icon: this._mapWeatherIcon(w2.state),
      wind: Math.round(attrNum(w2, "wind_speed", 0))
    };
  }
  _mapWeatherIcon(state) {
    if (state.includes("sunny") || state === "clear-night") return "sun";
    if (state.includes("rain") || state.includes("pour")) return "rain";
    if (state.includes("cloud")) return "cloud";
    if (state.includes("partlycloudy")) return "partly-cloudy";
    return "partly-cloudy";
  }
  render() {
    const rooms = this.config.rooms ?? {};
    const presence = this._presenceCount();
    const weather = this._weather();
    return b`
      <div class="brand">
        <div class="brand-mark">
          <lw-icon name="home" .size=${16} .stroke=${2}></lw-icon>
        </div>
        <div style="flex:1;min-width:0">
          <div class="brand-name">${this.config.household_name}</div>
          <div class="brand-sub">Home Assistant</div>
        </div>
      </div>

      <div class="section">Übersicht</div>
      <button
        class=${"item " + (this.page === "overview" ? "active" : "")}
        @click=${() => this._go("overview")}
      >
        <span class="ic"><lw-icon name="sparkle" .size=${17}></lw-icon></span>
        <span class="label">Dashboard</span>
        ${presence.total > 0 ? b`<span class="badge">${presence.home}/${presence.total}</span>` : null}
      </button>

      <div class="section">Räume</div>
      <div class="rooms">
        ${Object.entries(rooms).map(([key, room]) => {
      const count = this._onCount(room);
      return b`
            <button
              class=${"item " + (this.page === key ? "active" : "")}
              @click=${() => this._go(key)}
            >
              <span class="ic"
                ><lw-icon name=${room.icon ?? "cog"} .size=${17}></lw-icon
              ></span>
              <span class="label">${room.name}</span>
              ${count > 0 ? b`<span class="badge accent">● ${count}</span>` : null}
            </button>
          `;
    })}
      </div>

      ${weather ? b`
            <div class="foot">
              <lw-icon name=${weather.icon} .size=${22} style="color:var(--amber)"></lw-icon>
              <div style="flex:1;min-width:0">
                <div class="foot-temp">${Number.isFinite(weather.temp) ? weather.temp + "°" : "–°"}</div>
                <div class="foot-label">außen · ${weather.wind} km/h</div>
              </div>
              <button
                class="gear"
                title="Konfiguration"
                @click=${() => this.dispatchEvent(
      new CustomEvent("open-config", { bubbles: true, composed: true })
    )}
              >
                <lw-icon name="gear" .size=${16}></lw-icon>
              </button>
            </div>
          ` : b`
            <div class="foot" style="justify-content:flex-end">
              <button
                class="gear"
                title="Konfiguration"
                @click=${() => this.dispatchEvent(
      new CustomEvent("open-config", { bubbles: true, composed: true })
    )}
              >
                <lw-icon name="gear" .size=${16}></lw-icon>
              </button>
            </div>
          `}
    `;
  }
};
LwSidebar.styles = i$3`
    :host {
      display: flex;
      flex-direction: column;
      width: 200px;
      flex-shrink: 0;
      background: var(--bg-soft);
      border-right: 1px solid var(--border-soft);
      padding: 24px 14px 20px;
      gap: 6px;
      overflow: hidden;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px 18px;
    }
    .brand-mark {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: var(--text);
      color: var(--bg);
      display: grid;
      place-items: center;
      font-weight: 600;
    }
    .brand-name {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .brand-sub {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .section {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-faint);
      padding: 14px 10px 6px;
    }
    .rooms {
      display: flex;
      flex-direction: column;
      gap: 1px;
      overflow: auto;
      min-height: 0;
    }
    .rooms::-webkit-scrollbar {
      width: 0;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 10px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--text);
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      transition: background 0.12s;
      position: relative;
    }
    .item:hover {
      background: var(--hover-bg);
    }
    .item.active {
      background: var(--card);
      box-shadow: var(--shadow-sm);
    }
    .item .ic {
      color: var(--text-muted);
      flex-shrink: 0;
      display: inline-flex;
    }
    .item.active .ic {
      color: var(--text);
    }
    .label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      margin-left: auto;
      font-size: 11px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
    .badge.accent {
      color: var(--amber);
    }
    .foot {
      margin-top: auto;
      padding: 12px 10px;
      border-top: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .foot-temp {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.02em;
      font-family: 'Geist Mono', monospace;
    }
    .foot-label {
      font-size: 11px;
      color: var(--text-muted);
    }
    .gear {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      cursor: pointer;
      flex-shrink: 0;
    }
    .gear:hover {
      color: var(--text);
      background: var(--card);
    }
  `;
__decorateClass$y([
  n2({ attribute: false })
], LwSidebar.prototype, "hass", 2);
__decorateClass$y([
  n2({ attribute: false })
], LwSidebar.prototype, "config", 2);
__decorateClass$y([
  n2({ type: String })
], LwSidebar.prototype, "page", 2);
LwSidebar = __decorateClass$y([
  t("lw-sidebar")
], LwSidebar);
var __defProp$x = Object.defineProperty;
var __getOwnPropDesc$x = Object.getOwnPropertyDescriptor;
var __decorateClass$x = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$x(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$x(target, key, result);
  return result;
};
let LwTopbar = class extends i {
  constructor() {
    super(...arguments);
    this.time = /* @__PURE__ */ new Date();
  }
  _greet() {
    const h2 = this.time.getHours();
    if (h2 < 5) return "Gute Nacht";
    if (h2 < 11) return "Guten Morgen";
    if (h2 < 17) return "Hallo";
    if (h2 < 22) return "Guten Abend";
    return "Gute Nacht";
  }
  _userName() {
    return this.hass?.user?.name?.split(" ")[0] ?? "";
  }
  _dateTime() {
    const lang = this.hass?.language || "de-DE";
    const dateStr = this.time.toLocaleDateString(lang, {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
    const timeStr = this.time.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
    return `${dateStr} · ${timeStr}`;
  }
  _initials(name) {
    return name.split(/\s+/).map((p2) => p2[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  }
  _avatarColor(id) {
    const palette = ["#7e8f70", "#c47556", "#6e8a9e", "#d9a25a", "#a3b58c", "#d88366"];
    let hash = 0;
    for (let i2 = 0; i2 < id.length; i2++) hash = hash * 31 + id.charCodeAt(i2) >>> 0;
    return palette[hash % palette.length];
  }
  render() {
    const persons = this.config?.overview?.presence ?? [];
    const weatherEntity = entityState(this.hass, this.config?.overview?.weather);
    const userName = this._userName();
    return b`
      <div class="bar">
        <div>
          <div class="greeting">
            ${this.heading ? this.heading : b`${this._greet()}, <em>${userName}</em>`}
          </div>
          <div class="sub">${this.subtitle ?? this._dateTime()}</div>
        </div>
        <div class="right">
          ${weatherEntity ? b`
                <div class="weather">
                  <lw-icon
                    name="partly-cloudy"
                    .size=${16}
                    style="color:var(--amber)"
                  ></lw-icon>
                  <span class="t"
                    >${Math.round(attrNum(weatherEntity, "temperature", NaN))}°C</span
                  >
                  <span class="lbl">außen</span>
                </div>
              ` : A}
          ${persons.length > 0 ? b`
                <div class="presence">
                  ${persons.map((id) => {
      const e2 = entityState(this.hass, id);
      if (!e2) return null;
      const home = e2.state === "home";
      const name = friendlyName(e2, id.split(".")[1]);
      return b`
                      <div
                        class=${"avatar " + (home ? "home" : "away")}
                        style=${`background:${this._avatarColor(id)}`}
                        title=${name + (home ? " · zuhause" : " · unterwegs")}
                      >
                        ${this._initials(name)}
                        <span class="dot"></span>
                      </div>
                    `;
    })}
                </div>
              ` : A}
        </div>
      </div>
    `;
  }
};
LwTopbar.styles = i$3`
    :host {
      display: block;
    }
    .bar {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
    }
    .greeting {
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.025em;
      line-height: 1;
    }
    .greeting em {
      font-style: normal;
      color: var(--text-muted);
      font-weight: 400;
    }
    .sub {
      margin-top: 6px;
      font-size: 12.5px;
      color: var(--text-muted);
      letter-spacing: 0.005em;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .weather {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--card);
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      font-family: 'Geist Mono', monospace;
    }
    .weather .t {
      font-size: 13px;
      font-weight: 500;
    }
    .weather .lbl {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist', sans-serif;
    }
    .presence {
      display: flex;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid var(--bg);
      margin-left: -8px;
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 600;
      color: white;
      position: relative;
    }
    .avatar:first-child {
      margin-left: 0;
    }
    .avatar.away {
      filter: grayscale(0.9) opacity(0.55);
    }
    .avatar .dot {
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--bg);
    }
    .avatar.home .dot {
      background: var(--accent);
    }
    .avatar.away .dot {
      background: var(--text-faint);
    }
  `;
__decorateClass$x([
  n2({ attribute: false })
], LwTopbar.prototype, "hass", 2);
__decorateClass$x([
  n2({ attribute: false })
], LwTopbar.prototype, "config", 2);
__decorateClass$x([
  n2({ type: String })
], LwTopbar.prototype, "heading", 2);
__decorateClass$x([
  n2({ type: String })
], LwTopbar.prototype, "subtitle", 2);
__decorateClass$x([
  n2({ attribute: false })
], LwTopbar.prototype, "time", 2);
LwTopbar = __decorateClass$x([
  t("lw-topbar")
], LwTopbar);
var __defProp$w = Object.defineProperty;
var __getOwnPropDesc$w = Object.getOwnPropertyDescriptor;
var __decorateClass$w = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$w(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$w(target, key, result);
  return result;
};
let LwSectionHead = class extends i {
  constructor() {
    super(...arguments);
    this.sub = "";
    this.heading = "";
  }
  render() {
    return b`
      <div class="group">
        <div class="sub">${this.sub}</div>
        <div class="title">${this.heading}</div>
      </div>
      <slot name="right"></slot>
    `;
  }
};
LwSectionHead.styles = i$3`
    :host {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }
    .group {
      min-width: 0;
    }
    .sub {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-faint);
    }
    .title {
      font-size: 15px;
      font-weight: 500;
      letter-spacing: -0.01em;
      margin-top: 2px;
      color: var(--text);
    }
    ::slotted([slot='right']) {
      flex-shrink: 0;
    }
  `;
__decorateClass$w([
  n2({ type: String })
], LwSectionHead.prototype, "sub", 2);
__decorateClass$w([
  n2({ type: String })
], LwSectionHead.prototype, "heading", 2);
LwSectionHead = __decorateClass$w([
  t("lw-section-head")
], LwSectionHead);
var __defProp$v = Object.defineProperty;
var __getOwnPropDesc$v = Object.getOwnPropertyDescriptor;
var __decorateClass$v = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$v(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$v(target, key, result);
  return result;
};
const ICON_MAP = {
  sunny: "sun",
  "clear-night": "moon",
  cloudy: "cloud",
  partlycloudy: "partly-cloudy",
  rainy: "rain",
  pouring: "rain",
  snowy: "cloud",
  fog: "cloud",
  hail: "rain",
  lightning: "rain",
  windy: "wind"
};
let LwWeatherCard = class extends i {
  _conditionLabel(state) {
    const map = {
      sunny: "Sonnig",
      "clear-night": "Klar",
      cloudy: "Bewölkt",
      partlycloudy: "Teils bewölkt",
      rainy: "Regen",
      pouring: "Starkregen",
      snowy: "Schnee",
      fog: "Nebel",
      windy: "Windig"
    };
    return map[state] ?? state;
  }
  _icon(state) {
    return ICON_MAP[state] ?? "partly-cloudy";
  }
  _forecastDay(idx) {
    const d2 = /* @__PURE__ */ new Date();
    d2.setDate(d2.getDate() + idx);
    return d2.toLocaleDateString("de-DE", { weekday: "short" }).replace(".", "");
  }
  render() {
    const e2 = entityState(this.hass, this.entity);
    if (!e2) {
      return b`<div class="card">
        <lw-section-head sub="Außen" heading="Wetter"></lw-section-head>
        <div class="empty">Kein Wetter-Entity konfiguriert</div>
      </div>`;
    }
    const temp = Math.round(attrNum(e2, "temperature", NaN));
    const wind = Math.round(attrNum(e2, "wind_speed", 0));
    const humidity = Math.round(attrNum(e2, "humidity", 0));
    const forecast = e2.attributes.forecast ?? [];
    return b`
      <div class="card">
        <lw-section-head sub="Außen" heading=${"Wetter · " + (this.hass?.config?.location_name ?? "")}></lw-section-head>
        <div class="row">
          <div class="icon">
            <lw-icon name=${this._icon(e2.state)} .size=${64} .stroke=${1.2}></lw-icon>
          </div>
          <div>
            <div class="temp">
              ${Number.isFinite(temp) ? temp : "–"}<span class="u">°C</span>
            </div>
            <div class="desc">${this._conditionLabel(e2.state)}</div>
          </div>
        </div>
        <div class="metrics">
          <div class="metric">
            <div class="l"><lw-icon name="wind" .size=${12}></lw-icon>Wind</div>
            <div class="v">${wind} km/h</div>
          </div>
          <div class="metric">
            <div class="l"><lw-icon name="droplet" .size=${12}></lw-icon>Feuchte</div>
            <div class="v">${humidity}%</div>
          </div>
          <div class="metric">
            <div class="l"><lw-icon name="leaf" .size=${12}></lw-icon>Luft</div>
            <div class="v">${attrNum(e2, "air_quality", 0) || "–"}</div>
          </div>
        </div>
        ${forecast.length > 0 ? b`<div class="forecast">
              ${forecast.slice(0, 5).map(
      (f2, i2) => b`
                  <div class="day">
                    <div class="d">${this._forecastDay(i2 + 1)}</div>
                    <div class="i">
                      <lw-icon
                        name=${this._icon(f2.condition ?? "")}
                        .size=${20}
                      ></lw-icon>
                    </div>
                    <div class="t">
                      ${Math.round(f2.temperature ?? f2.high ?? 0)}°
                      <span class="lo"
                        >${Math.round(f2.templow ?? f2.low ?? 0)}°</span
                      >
                    </div>
                  </div>
                `
    )}
            </div>` : A}
      </div>
    `;
  }
};
LwWeatherCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .icon {
      color: var(--amber);
    }
    .temp {
      font-size: 48px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .temp .u {
      font-size: 22px;
      color: var(--text-muted);
    }
    .desc {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-top: 12px;
    }
    .metric {
      background: var(--card-inset);
      border-radius: 10px;
      padding: 8px 10px;
    }
    .metric .l {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-muted);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }
    .metric .v {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
    }
    .forecast {
      margin-top: auto;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      gap: 4px;
    }
    .day {
      flex: 1;
      text-align: center;
    }
    .day .d {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .day .i {
      color: var(--amber);
      margin: 4px 0;
      display: grid;
      place-items: center;
    }
    .day .t {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
    }
    .day .t .lo {
      color: var(--text-faint);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;
__decorateClass$v([
  n2({ attribute: false })
], LwWeatherCard.prototype, "hass", 2);
__decorateClass$v([
  n2({ type: String })
], LwWeatherCard.prototype, "entity", 2);
LwWeatherCard = __decorateClass$v([
  t("lw-weather-card")
], LwWeatherCard);
var __defProp$u = Object.defineProperty;
var __getOwnPropDesc$u = Object.getOwnPropertyDescriptor;
var __decorateClass$u = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$u(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$u(target, key, result);
  return result;
};
let LwPill = class extends i {
  constructor() {
    super(...arguments);
    this.color = "var(--accent)";
    this.soft = false;
  }
  render() {
    this.style.color = this.soft ? this.color : "white";
    this.style.background = this.soft ? `color-mix(in oklab, ${this.color} 16%, transparent)` : this.color;
    return b`<slot></slot>`;
  }
};
LwPill.styles = i$3`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      font-size: 11px;
      font-weight: 500;
      border-radius: 999px;
      line-height: 1.2;
    }
  `;
__decorateClass$u([
  n2({ type: String })
], LwPill.prototype, "color", 2);
__decorateClass$u([
  n2({ type: Boolean })
], LwPill.prototype, "soft", 2);
LwPill = __decorateClass$u([
  t("lw-pill")
], LwPill);
var __defProp$t = Object.defineProperty;
var __getOwnPropDesc$t = Object.getOwnPropertyDescriptor;
var __decorateClass$t = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$t(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$t(target, key, result);
  return result;
};
let LwDualBars = class extends i {
  constructor() {
    super(...arguments);
    this.pv = [];
    this.use = [];
    this.height = 36;
  }
  render() {
    const peak = Math.max(...this.pv, ...this.use, 1) * 1.1;
    return b`
      <div class="row" style=${`height:${this.height}px`}>
        ${this.pv.map((v2, i2) => {
      const u2 = this.use[i2] || 0;
      return b`
            <div class="col" style=${`height:${this.height}px`}>
              <div
                class="bar pv"
                style=${`height:${v2 / peak * this.height}px`}
              ></div>
              <div
                class="bar use"
                style=${`height:${u2 / peak * this.height}px`}
              ></div>
            </div>
          `;
    })}
      </div>
    `;
  }
};
LwDualBars.styles = i$3`
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: flex-end;
      gap: 1px;
      width: 100%;
    }
    .col {
      flex: 1;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .bar {
      position: absolute;
      bottom: 0;
      width: 4px;
      border-radius: 1px;
    }
    .pv {
      background: var(--amber);
      opacity: 0.85;
      left: 40%;
    }
    .use {
      background: var(--blue);
      opacity: 0.7;
      right: 40%;
    }
  `;
__decorateClass$t([
  n2({ type: Array })
], LwDualBars.prototype, "pv", 2);
__decorateClass$t([
  n2({ type: Array })
], LwDualBars.prototype, "use", 2);
__decorateClass$t([
  n2({ type: Number })
], LwDualBars.prototype, "height", 2);
LwDualBars = __decorateClass$t([
  t("lw-dual-bars")
], LwDualBars);
var __defProp$s = Object.defineProperty;
var __getOwnPropDesc$s = Object.getOwnPropertyDescriptor;
var __decorateClass$s = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$s(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$s(target, key, result);
  return result;
};
let LwEnergyCard = class extends i {
  constructor() {
    super(...arguments);
    this.energy = {};
  }
  _v(id) {
    return stateNum(entityState(this.hass, id));
  }
  _scale(id, toKw) {
    const e2 = entityState(this.hass, id);
    if (!e2) return 0;
    const v2 = stateNum(e2);
    const unit = (e2.attributes.unit_of_measurement ?? "").toString().toLowerCase();
    if (toKw && unit === "w") return v2 / 1e3;
    if (!toKw && unit === "kw") return v2 * 1e3;
    return v2;
  }
  _fmtKw(kw) {
    if (kw >= 1 || kw <= -1) return { v: kw.toFixed(2), u: "kW" };
    return { v: (kw * 1e3).toFixed(0), u: "W" };
  }
  render() {
    const pvNow = this._scale(this.energy.pv_now, true);
    const cons = this._scale(this.energy.consumption, true);
    const feed = this._scale(this.energy.grid_feed, true);
    const draw = this._scale(this.energy.grid_draw, true);
    const batLevel = this._v(this.energy.battery_level);
    const batFlow = this._scale(this.energy.battery_flow, true);
    const pvToday = this._v(this.energy.pv_today);
    const selfPct = pvNow > 0 ? Math.min(100, Math.round(Math.min(cons, pvNow) / Math.max(cons, 0.01) * 100)) : 0;
    const anyConfigured = !!(this.energy.pv_now || this.energy.consumption || this.energy.grid_feed || this.energy.battery_level);
    if (!anyConfigured) {
      return b`<div class="card">
        <lw-section-head sub="Live" heading="Energie · Heute"></lw-section-head>
        <div class="empty">Keine Energie-Entities konfiguriert</div>
      </div>`;
    }
    const pv = this._fmtKw(pvNow);
    const use = this._fmtKw(cons);
    const grid = feed > 0 ? this._fmtKw(feed) : this._fmtKw(draw);
    const gridLabel = feed > 0 ? "Einspeisung" : "Bezug";
    const battery = this._fmtKw(Math.abs(batFlow));
    return b`
      <div class="card">
        <lw-section-head sub="Live" heading="Energie · Heute">
          <span slot="right">
            <lw-pill color="var(--accent)" .soft=${true}
              >● ${pvToday.toFixed(1)} kWh heute</lw-pill
            >
          </span>
        </lw-section-head>

        <div class="self-row">
          <div class="self-val">${selfPct}%</div>
          <div class="self-lbl">Eigenversorgung</div>
        </div>

        <div class="flow">
          <div class="stat pv">
            <div class="label"><lw-icon name="sun" .size=${12}></lw-icon>Solar</div>
            <div class="value">${pv.v}<span class="unit">${pv.u}</span></div>
            <div class="sub">heute ${pvToday.toFixed(1)} kWh</div>
          </div>
          <div class="stat use">
            <div class="label"><lw-icon name="bolt" .size=${12}></lw-icon>Hausnetz</div>
            <div class="value">${use.v}<span class="unit">${use.u}</span></div>
            <div class="sub">Verbrauch jetzt</div>
          </div>
          <div class="stat grid">
            <div class="label">
              <lw-icon name=${feed > 0 ? "arrow-up" : "arrow-down"} .size=${12}></lw-icon>${gridLabel}
            </div>
            <div class="value">${grid.v}<span class="unit">${grid.u}</span></div>
            <div class="sub">Netz</div>
          </div>
          <div class="stat bat">
            <div class="label"><lw-icon name="bolt" .size=${12}></lw-icon>Akku</div>
            <div class="value">${batLevel.toFixed(0)}<span class="unit">%</span></div>
            <div class="sub">
              ${batFlow < 0 ? "Lädt" : batFlow > 0 ? "Entlädt" : "Idle"} ${battery.v} ${battery.u}
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
LwEnergyCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card-elev);
      /* Tight shadow — keeps elevation cue without bleeding into the
         gap below the card, which previously read as "scenes overlap". */
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .self-row {
      display: flex;
      align-items: baseline;
      gap: 14px;
      margin-bottom: 12px;
    }
    .self-val {
      font-size: 44px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .self-lbl {
      font-size: 12px;
      color: var(--text-muted);
    }
    .flow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      flex: 1;
      min-height: 0;
    }
    .stat {
      background: var(--card-inset);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .stat .label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .stat .value {
      font-family: 'Geist Mono', monospace;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 4px;
    }
    .stat .unit {
      font-size: 12px;
      color: var(--text-muted);
    }
    .stat .sub {
      font-size: 10.5px;
      color: var(--text-faint);
    }
    .stat.pv .label {
      color: var(--amber);
    }
    .stat.use .label {
      color: var(--blue);
    }
    .stat.bat .label {
      color: var(--accent);
    }
    .stat.grid .label {
      color: var(--text);
    }
    .chart-wrap {
      margin-top: 12px;
    }
    .chart-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10px;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .legend {
      display: flex;
      gap: 12px;
    }
    .legend span span.sw {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      margin-right: 4px;
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-family: 'Geist Mono', monospace;
      font-size: 9px;
      color: var(--text-faint);
      margin-top: 4px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
      padding: 40px 0;
    }
  `;
__decorateClass$s([
  n2({ attribute: false })
], LwEnergyCard.prototype, "hass", 2);
__decorateClass$s([
  n2({ attribute: false })
], LwEnergyCard.prototype, "energy", 2);
LwEnergyCard = __decorateClass$s([
  t("lw-energy-card")
], LwEnergyCard);
var __defProp$r = Object.defineProperty;
var __getOwnPropDesc$r = Object.getOwnPropertyDescriptor;
var __decorateClass$r = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$r(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$r(target, key, result);
  return result;
};
const ACTIVE_STATES = /* @__PURE__ */ new Set([
  "running",
  "in_use",
  "active",
  "cleaning",
  "mowing",
  "on",
  "returning",
  "paused",
  "rinse_hold",
  "autocleaning",
  "super_cooling",
  "super_freezing",
  "super_heating",
  "spinning",
  "washing",
  "drying",
  "rinsing",
  "finishing"
]);
const ERROR_STATES = /* @__PURE__ */ new Set(["error", "failure", "failed", "fault"]);
const APPLIANCE_ICON = {
  dishwasher: "water",
  geschirr: "water",
  washer: "washer",
  wasch: "washer",
  dryer: "fan",
  trockner: "fan",
  oven: "oven",
  backofen: "oven"
};
let LwInfosCard = class extends i {
  constructor() {
    super(...arguments);
    this._wasteToday = [];
    this._lastWasteFetch = 0;
  }
  updated() {
    if (!this.hass) return;
    const cal = this.config?.overview?.events?.waste_calendar;
    if (!cal) return;
    if (Date.now() - this._lastWasteFetch < 30 * 60 * 1e3) return;
    this._lastWasteFetch = Date.now();
    void this._fetchWasteToday();
  }
  async _fetchWasteToday() {
    if (!this.hass) return;
    const cal = this.config?.overview?.events?.waste_calendar;
    if (!cal) return;
    const start = /* @__PURE__ */ new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59);
    try {
      const evs = await this.hass.callApi(
        "GET",
        `calendars/${cal}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
      );
      this._wasteToday = Array.isArray(evs) ? evs : [];
    } catch {
      this._wasteToday = [];
    }
  }
  // ---- Alarm ----
  _alarmMode() {
    const e2 = entityState(this.hass, this.config?.overview?.alarm_panel);
    if (!e2) return "off";
    if (e2.state === "armed_home") return "home";
    if (e2.state === "armed_away") return "away";
    return "off";
  }
  _setAlarmMode(mode) {
    if (!this.hass) return;
    const e2 = this.config?.overview?.alarm_panel;
    if (!e2) return;
    if (mode === "off")
      void this.hass.callService("alarm_control_panel", "alarm_disarm", {}, { entity_id: e2 });
    else if (mode === "home")
      void this.hass.callService("alarm_control_panel", "alarm_arm_home", {}, { entity_id: e2 });
    else
      void this.hass.callService("alarm_control_panel", "alarm_arm_away", {}, { entity_id: e2 });
  }
  // ---- Discoveries ----
  _runningAppliances() {
    const list = this.config?.overview?.events?.appliances ?? [];
    const out = [];
    list.forEach((a2) => {
      const stE = entityState(this.hass, a2.state_entity);
      if (!stE) return;
      const state2 = stE.state ?? "";
      if (!ACTIVE_STATES.has(state2.toLowerCase())) return;
      const progE = entityState(this.hass, a2.progress_entity);
      let progress = progE ? parseFloat(progE.state) : NaN;
      if (!Number.isFinite(progress)) progress = attrNum(stE, "progress", NaN);
      const remE = entityState(this.hass, a2.remaining_entity);
      let remaining = remE?.state ?? "";
      if (!remaining) {
        const mins = attrNum(stE, "remaining_time", NaN);
        if (Number.isFinite(mins)) remaining = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;
      }
      const n3 = (a2.name || "").toLowerCase();
      let icon = a2.icon ?? "cog";
      if (!a2.icon) {
        for (const [k2, v2] of Object.entries(APPLIANCE_ICON)) {
          if (n3.includes(k2)) {
            icon = v2;
            break;
          }
        }
      }
      out.push({ a: a2, state: state2, progress: Number.isFinite(progress) ? progress : 0, remaining, icon });
    });
    return out;
  }
  _allExtras() {
    const rooms = this.config?.rooms ?? {};
    const out = [];
    Object.values(rooms).forEach((r2) => {
      (r2.extras ?? []).forEach((x2) => out.push(x2));
    });
    return out;
  }
  _erroringDevices() {
    const out = [];
    this._allExtras().forEach((x2) => {
      if (!["vacuum", "mower", "irrigation"].includes(x2.kind)) return;
      if (!x2.entity) return;
      const e2 = entityState(this.hass, x2.entity);
      if (!e2) return;
      const s2 = e2.state.toLowerCase();
      const isError = ERROR_STATES.has(s2) || e2.attributes.error && e2.attributes.error !== "none";
      if (isError) out.push({ extra: x2, e: e2 });
    });
    return out;
  }
  _stateLabel(s2) {
    const map = {
      running: "läuft",
      cleaning: "reinigt",
      mowing: "mäht",
      paused: "pausiert",
      drying: "trocknet",
      washing: "wäscht",
      rinsing: "spült",
      spinning: "schleudert",
      in_use: "läuft",
      finished: "fertig",
      finishing: "beendet",
      programmed: "programmiert",
      docked: "lädt",
      idle: "bereit",
      returning: "fährt zurück",
      end_programmed: "beendet"
    };
    return map[s2.toLowerCase()] ?? s2;
  }
  // ---- Status rows ----
  _doorsLocks() {
    const states = this.hass?.states ?? {};
    const locks = Object.values(states).filter((s2) => s2.entity_id.startsWith("lock."));
    return {
      locked: locks.filter((s2) => s2.state === "locked").length,
      total: locks.length
    };
  }
  _windows() {
    const states = this.hass?.states ?? {};
    const w2 = Object.values(states).filter(
      (s2) => s2.entity_id.startsWith("binary_sensor.") && (s2.attributes.device_class === "window" || s2.attributes.device_class === "door")
    );
    return { open: w2.filter((s2) => isOn(s2.state)).length, total: w2.length };
  }
  render() {
    const mode = this._alarmMode();
    const hasAlarm = !!this.config?.overview?.alarm_panel;
    const doors = this._doorsLocks();
    const wins = this._windows();
    const allOk = doors.locked === doors.total && wins.open === 0;
    const apps = this._runningAppliances();
    const errors = this._erroringDevices();
    const waste = this._wasteToday;
    const hasAny = apps.length > 0 || errors.length > 0 || waste.length > 0;
    return b`
      <div class="card">
        <lw-section-head sub="Status" heading="Infos">
          ${hasAlarm ? b`<lw-pill
                slot="right"
                color=${allOk && mode !== "off" ? "var(--accent)" : errors.length ? "var(--warn)" : "var(--amber)"}
                .soft=${true}
              >
                ● ${errors.length > 0 ? `${errors.length} Fehler` : allOk && mode !== "off" ? "Alles ok" : "Hinweis"}
              </lw-pill>` : ""}
        </lw-section-head>

        ${hasAlarm ? b`
              <div class="alarm-modes">
                ${[
      { id: "home", name: "Daheim", icon: "home" },
      { id: "away", name: "Unterwegs", icon: "arrow-right" },
      { id: "off", name: "Aus", icon: "x" }
    ].map(
      (m2) => b`
                    <button
                      class=${"alarm-mode " + (mode === m2.id ? "active" : "")}
                      @click=${() => this._setAlarmMode(m2.id)}
                    >
                      <lw-icon name=${m2.icon} .size=${13}></lw-icon>${m2.name}
                    </button>
                  `
    )}
              </div>
            ` : ""}

        <div class="list">
          ${errors.length ? b`
                <div class="header-tag">Fehler</div>
                ${errors.map(
      ({ extra, e: e2 }) => b`
                    <div class="row warn">
                      <div class="ico error">
                        <lw-icon
                          name=${extra.kind === "vacuum" ? "vacuum" : extra.kind === "mower" ? "leaf" : "water"}
                          .size=${14}
                        ></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">${extra.name || friendlyName(e2, extra.entity)}</div>
                        <div class="sub">
                          ${e2.attributes.error || this._stateLabel(e2.state)}
                        </div>
                      </div>
                    </div>
                  `
    )}
              ` : A}
          ${apps.length ? b`
                <div class="header-tag">Läuft gerade</div>
                ${apps.map(
      ({ a: a2, state: state2, progress, remaining, icon }) => b`
                    <div class="row active">
                      <div class="ico appliance active">
                        <lw-icon name=${icon} .size=${14}></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">${a2.name}</div>
                        <div class="sub">
                          ${this._stateLabel(state2)}${remaining ? ` · noch ${remaining}` : ""}
                        </div>
                        ${progress > 0 ? b`<div class="progress">
                              <div class="bar" style=${`width:${Math.min(100, progress)}%`}></div>
                            </div>` : A}
                      </div>
                      ${progress > 0 ? b`<div class="val">${Math.round(progress)}%</div>` : A}
                    </div>
                  `
    )}
              ` : A}
          ${waste.length ? b`
                <div class="header-tag">Abholung heute</div>
                ${waste.map(
      (w2) => b`
                    <div class="row">
                      <div class="ico waste"><lw-icon name="package" .size=${14}></lw-icon></div>
                      <div class="body">
                        <div class="name">${w2.summary}</div>
                        <div class="sub">heute</div>
                      </div>
                    </div>
                  `
    )}
              ` : A}
          ${hasAlarm || doors.total > 0 || wins.total > 0 ? b`
                <div class="row status">
                  <div class=${"ico " + (doors.locked === doors.total || doors.total === 0 ? "ok" : "warn")}>
                    <lw-icon name="lock" .size=${13}></lw-icon>
                  </div>
                  <div class="body">
                    <div class="name">
                      ${doors.total === 0 ? "Keine Schlösser" : "Türen"}
                    </div>
                  </div>
                  <div class="val">${doors.locked}/${doors.total}</div>
                </div>
                <div class="row status">
                  <div class=${"ico " + (wins.open === 0 ? "ok" : "warn")}>
                    <lw-icon name="blinds" .size=${13}></lw-icon>
                  </div>
                  <div class="body">
                    <div class="name">
                      ${wins.open === 0 ? "Alle Fenster zu" : `${wins.open} Fenster offen`}
                    </div>
                  </div>
                  <div class="val">${wins.total - wins.open}/${wins.total}</div>
                </div>
                ${hasAlarm ? b`<div class="row status">
                      <div class=${"ico " + (mode !== "off" ? "ok" : "warn")}>
                        <lw-icon name="shield-check" .size=${13}></lw-icon>
                      </div>
                      <div class="body">
                        <div class="name">Alarmanlage</div>
                      </div>
                      <div class="val">${mode === "off" ? "Aus" : "Scharf"}</div>
                    </div>` : A}
              ` : !hasAny ? b`<div class="empty">Alles ruhig</div>` : A}
        </div>
      </div>
    `;
  }
};
LwInfosCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      gap: 12px;
      overflow: hidden;
    }
    .alarm-modes {
      display: flex;
      gap: 3px;
      padding: 3px;
      background: var(--card-inset);
      border-radius: 11px;
    }
    .alarm-mode {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 5px;
      justify-content: center;
      padding: 7px 6px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .alarm-mode.active {
      background: var(--card-elev);
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }
    .list {
      flex: 1;
      min-height: 0;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .list::-webkit-scrollbar {
      width: 0;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12.5px;
      padding: 16px 0;
      text-align: center;
    }
    .header-tag {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-faint);
      padding: 6px 4px 2px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 11px;
      border: 1px solid var(--border-soft);
      background: var(--card-inset);
    }
    .row.active {
      border-color: color-mix(in oklab, var(--accent) 35%, var(--border-soft));
      background: color-mix(in oklab, var(--accent) 8%, var(--card-inset));
    }
    .row.warn {
      border-color: color-mix(in oklab, var(--warn) 40%, var(--border-soft));
      background: color-mix(in oklab, var(--warn) 10%, var(--card-inset));
    }
    .row.status {
      background: transparent;
      border: none;
      border-top: 1px solid var(--border-soft);
      border-radius: 0;
      padding: 8px 4px;
    }
    .ico {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .ico.appliance.active {
      background: var(--accent);
      color: white;
    }
    .ico.error {
      background: var(--warn);
      color: white;
    }
    .ico.waste {
      background: color-mix(in oklab, var(--amber) 25%, transparent);
      color: var(--amber);
    }
    .ico.ok {
      background: color-mix(in oklab, var(--accent) 14%, transparent);
      color: var(--accent);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 1px;
    }
    .row.warn .sub {
      color: var(--warn);
    }
    .progress {
      margin-top: 5px;
      height: 4px;
      background: var(--card);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress .bar {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 0.4s ease-out;
    }
    .val {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      min-width: 36px;
      text-align: right;
    }
  `;
__decorateClass$r([
  n2({ attribute: false })
], LwInfosCard.prototype, "hass", 2);
__decorateClass$r([
  n2({ attribute: false })
], LwInfosCard.prototype, "config", 2);
__decorateClass$r([
  r()
], LwInfosCard.prototype, "_wasteToday", 2);
LwInfosCard = __decorateClass$r([
  t("lw-infos-card")
], LwInfosCard);
var __defProp$q = Object.defineProperty;
var __getOwnPropDesc$q = Object.getOwnPropertyDescriptor;
var __decorateClass$q = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$q(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$q(target, key, result);
  return result;
};
const DEFAULT_SCENE_ICON = {
  morning: "sun",
  aufstehen: "sun",
  work: "desk",
  arbeit: "desk",
  dinner: "chair",
  abendessen: "chair",
  movie: "film",
  film: "film",
  read: "book",
  lesen: "book",
  goodnight: "moon",
  schlaf: "moon",
  leaving: "door",
  verlassen: "door"
};
let LwScenesRow = class extends i {
  constructor() {
    super(...arguments);
    this.scenes = [];
    this._firing = null;
  }
  _icon(id, name) {
    const key = (name.toLowerCase() + " " + id.toLowerCase()).split(/\s+/);
    for (const k2 of key) {
      if (DEFAULT_SCENE_ICON[k2]) return DEFAULT_SCENE_ICON[k2];
    }
    return "sparkle";
  }
  _run(id) {
    if (!this.hass) return;
    this._firing = id;
    callSceneActivate(this.hass, id);
    setTimeout(() => this._firing = null, 1200);
  }
  render() {
    if (!this.scenes.length) {
      return b`<div class="card">
        <lw-section-head sub="Schnellzugriff" heading="Szenen"></lw-section-head>
        <div class="empty">Keine Szenen konfiguriert</div>
      </div>`;
    }
    return b`
      <div class="card">
        <lw-section-head sub="Schnellzugriff" heading="Szenen"></lw-section-head>
        <div class="grid">
          ${this.scenes.map((id) => {
      const e2 = entityState(this.hass, id);
      const name = friendlyName(e2, id.split(".")[1]);
      return b`
              <button
                class=${"scene " + (this._firing === id ? "firing" : "")}
                @click=${() => this._run(id)}
              >
                <div class="ico">
                  <lw-icon name=${this._icon(id, name)} .size=${15}></lw-icon>
                </div>
                <div class="name">${name}</div>
              </button>
            `;
    })}
        </div>
      </div>
    `;
  }
};
LwScenesRow.styles = i$3`
    :host {
      display: block;
      width: 100%;
    }
    /* No card chrome — scenes is a quick-access strip that lives BETWEEN
       the two card rows. Giving it its own border/background made adjacent
       rounded corners visually crowd the cards above and below, reading as
       overlap. The section head + button grid float on the page bg instead. */
    .card {
      padding: 4px 2px 2px;
      box-sizing: border-box;
    }
    /* auto-fill (not auto-fit): keeps empty tracks so a single scene
       doesn't stretch to the full row width. */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 8px;
    }
    .scene {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 12px;
      color: var(--text);
      text-align: left;
      transition: background 0.2s, border-color 0.2s;
      cursor: pointer;
    }
    .scene.firing {
      background: var(--accent-soft);
      border-color: var(--accent);
    }
    .scene .ico {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
      border: 1px solid var(--border-soft);
    }
    .scene .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .scene .auto {
      font-family: 'Geist Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;
__decorateClass$q([
  n2({ attribute: false })
], LwScenesRow.prototype, "hass", 2);
__decorateClass$q([
  n2({ type: Array })
], LwScenesRow.prototype, "scenes", 2);
__decorateClass$q([
  r()
], LwScenesRow.prototype, "_firing", 2);
LwScenesRow = __decorateClass$q([
  t("lw-scenes-row")
], LwScenesRow);
var __defProp$p = Object.defineProperty;
var __getOwnPropDesc$p = Object.getOwnPropertyDescriptor;
var __decorateClass$p = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$p(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$p(target, key, result);
  return result;
};
let LwSlider = class extends i {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.height = 6;
    this.knob = true;
    this._dragging = false;
    this._onMove = (e2) => {
      if (this._dragging) this._set(e2.clientX);
    };
    this._onUp = () => {
      if (this._dragging) {
        this._dragging = false;
        this.dispatchEvent(
          new CustomEvent("change-end", {
            detail: { value: this.value },
            bubbles: true,
            composed: true
          })
        );
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("pointermove", this._onMove);
    window.addEventListener("pointerup", this._onUp);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pointermove", this._onMove);
    window.removeEventListener("pointerup", this._onUp);
  }
  _down(e2) {
    e2.stopPropagation();
    this._dragging = true;
    this._set(e2.clientX);
  }
  _set(clientX) {
    const r2 = this._track.getBoundingClientRect();
    let v2 = (clientX - r2.left) / r2.width * (this.max - this.min) + this.min;
    v2 = Math.max(this.min, Math.min(this.max, v2));
    const rounded = Math.round(v2);
    if (rounded !== this.value) {
      this.value = rounded;
      this.dispatchEvent(
        new CustomEvent("change", { detail: { value: rounded }, bubbles: true, composed: true })
      );
    }
  }
  render() {
    const pct = Math.max(0, Math.min(100, (this.value - this.min) / (this.max - this.min) * 100));
    const accent = this.accent ?? "var(--text)";
    return b`
      <div class="s" style=${`height:${this.height}px`} @pointerdown=${this._down}>
        <div class="fill" style=${`width:${pct}%;background:${accent}`}></div>
        ${this.knob ? b`<div class="k" style=${`left:${pct}%;border-color:${accent}`}></div>` : null}
      </div>
    `;
  }
};
LwSlider.styles = i$3`
    :host {
      display: block;
      width: 100%;
    }
    .s {
      position: relative;
      width: 100%;
      background: var(--card-inset);
      border-radius: 999px;
      cursor: pointer;
      touch-action: none;
    }
    .fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: var(--text);
      border-radius: 999px;
    }
    .k {
      position: absolute;
      top: 50%;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--card-elev);
      border: 1.5px solid var(--text);
      transform: translate(-50%, -50%);
      box-shadow: var(--shadow-sm);
    }
  `;
__decorateClass$p([
  n2({ type: Number })
], LwSlider.prototype, "value", 2);
__decorateClass$p([
  n2({ type: Number })
], LwSlider.prototype, "min", 2);
__decorateClass$p([
  n2({ type: Number })
], LwSlider.prototype, "max", 2);
__decorateClass$p([
  n2({ type: Number })
], LwSlider.prototype, "height", 2);
__decorateClass$p([
  n2({ type: String })
], LwSlider.prototype, "accent", 2);
__decorateClass$p([
  n2({ type: Boolean })
], LwSlider.prototype, "knob", 2);
__decorateClass$p([
  e(".s")
], LwSlider.prototype, "_track", 2);
LwSlider = __decorateClass$p([
  t("lw-slider")
], LwSlider);
var __defProp$o = Object.defineProperty;
var __getOwnPropDesc$o = Object.getOwnPropertyDescriptor;
var __decorateClass$o = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$o(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$o(target, key, result);
  return result;
};
let LwMediaCard = class extends i {
  constructor() {
    super(...arguments);
    this._selected = null;
    this._syncOpen = false;
  }
  _allPlayers() {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const rooms = this.config?.rooms ?? {};
    Object.values(rooms).forEach((r2) => {
      if (r2.media_player && !seen.has(r2.media_player)) {
        seen.add(r2.media_player);
        out.push({ id: r2.media_player, name: r2.name });
      }
    });
    return out;
  }
  _activePlayer() {
    const players = this._allPlayers();
    if (this._selected && players.find((p2) => p2.id === this._selected)) return this._selected;
    const playing = players.find((p2) => entityState(this.hass, p2.id)?.state === "playing");
    return playing?.id ?? players[0]?.id ?? "";
  }
  _joinedMembers(id) {
    const e2 = entityState(this.hass, id);
    return e2?.attributes?.group_members ?? [];
  }
  _isJoined(master, member) {
    if (master === member) return true;
    return this._joinedMembers(master).includes(member);
  }
  _toggleJoin(master, member) {
    if (!this.hass || master === member) return;
    const joined = this._isJoined(master, member);
    if (joined) {
      void this.hass.callService("media_player", "unjoin", {}, { entity_id: member });
    } else {
      void this.hass.callService(
        "media_player",
        "join",
        { group_members: [member] },
        { entity_id: master }
      );
    }
  }
  _playRadio(player, r2) {
    if (!this.hass) return;
    void this.hass.callService(
      "media_player",
      "play_media",
      {
        media_content_id: r2.url,
        media_content_type: r2.content_type ?? "music"
      },
      { entity_id: player }
    );
  }
  _isPlayingRadio(player, r2) {
    const e2 = entityState(this.hass, player);
    if (!e2 || e2.state !== "playing") return false;
    const src = e2.attributes.media_content_id ?? "";
    return src === r2.url;
  }
  render() {
    const players = this._allPlayers();
    if (!players.length) {
      return b`<div class="card">
        <lw-section-head sub="Audio" heading="Multiroom"></lw-section-head>
        <div class="empty">Kein Media-Player konfiguriert</div>
      </div>`;
    }
    const playerId = this._activePlayer();
    const e2 = entityState(this.hass, playerId);
    const playing = e2?.state === "playing";
    const title = e2?.attributes?.media_title ?? "–";
    const artist = e2?.attributes?.media_artist ?? e2?.attributes?.app_name ?? e2?.attributes?.source ?? "";
    const vol = Math.round((e2?.attributes?.volume_level ?? 0) * 100);
    const art = e2?.attributes?.entity_picture ?? "";
    const radios = this.config.overview?.radios ?? [];
    const joinedCount = this._joinedMembers(playerId).length;
    return b`
      <div class="card">
        <lw-section-head sub="Multiroom" heading="Audio">
          <select
            slot="right"
            class="picker"
            style="max-width:140px"
            .value=${playerId}
            @change=${(ev) => this._selected = ev.target.value}
          >
            ${players.map(
      (p2) => b`<option value=${p2.id} ?selected=${p2.id === playerId}>${p2.name}</option>`
    )}
          </select>
        </lw-section-head>

        <div class="now">
          <div class=${"art " + (playing ? "playing" : "")} style=${art ? `background-image:url(${art})` : ""}>
            ${!art ? b`<lw-icon name="music" .size=${22}></lw-icon>` : A}
          </div>
          <div class="info">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
          </div>
          <button class="play" @click=${() => this.hass && callMediaPlay(this.hass, playerId, !playing)}>
            <lw-icon name=${playing ? "pause" : "play"} .size=${20}></lw-icon>
          </button>
        </div>

        <div class="vol">
          <lw-icon name="volume" .size=${13} style="color:var(--text-muted)"></lw-icon>
          <lw-slider
            .value=${vol}
            @change=${(ev) => this.hass && callMediaVolume(this.hass, playerId, ev.detail.value)}
          ></lw-slider>
          <span class="num">${vol}</span>
        </div>

        ${players.length > 1 ? b`
              <div class="speakers">
                <button
                  class=${"sync-btn" + (this._syncOpen ? " active" : "")}
                  @click=${() => this._syncOpen = !this._syncOpen}
                >
                  <lw-icon name="sound" .size=${13}></lw-icon>
                  Sync ${joinedCount > 0 ? `· ${joinedCount + 1}` : ""}
                </button>
              </div>
              ${this._syncOpen ? b`
                    <div class="sync-panel">
                      ${players.map((p2) => {
      const joined = this._isJoined(playerId, p2.id);
      const isMaster = p2.id === playerId;
      const st = entityState(this.hass, p2.id)?.state ?? "unknown";
      return b`
                          <div
                            class="sync-row"
                            @click=${() => !isMaster && this._toggleJoin(playerId, p2.id)}
                          >
                            <div class=${"check" + (joined ? " on" : "")}>
                              ${joined ? b`<lw-icon name="check" .size=${11} .stroke=${2.5}></lw-icon>` : A}
                            </div>
                            <div class="row-name">${p2.name}${isMaster ? " (Master)" : ""}</div>
                            <div class="row-state">${st}</div>
                          </div>
                        `;
    })}
                    </div>
                  ` : A}
            ` : A}

        ${radios.length > 0 ? b`
              <div class="radios-head">Radio-Sender</div>
              <div class="radio-grid">
                ${radios.map((r2) => {
      const active = this._isPlayingRadio(playerId, r2);
      return b`
                    <div
                      class=${"radio" + (active ? " playing" : "")}
                      style=${r2.logo ? `background-image:url(${r2.logo})` : ""}
                      title=${r2.name}
                      @click=${() => this._playRadio(playerId, r2)}
                    >
                      ${!r2.logo ? b`<div class="logo"><lw-icon name="music" .size=${18}></lw-icon></div>` : A}
                      ${!r2.logo ? b`<div class="nm">${r2.name}</div>` : A}
                    </div>
                  `;
    })}
              </div>
            ` : b`<div class="empty">Keine Radio-Sender konfiguriert</div>`}
      </div>
    `;
  }
};
LwMediaCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .now {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .art {
      width: 56px;
      height: 56px;
      border-radius: 11px;
      flex-shrink: 0;
      background: var(--card-inset) center/cover no-repeat;
      color: var(--text-muted);
      position: relative;
      overflow: hidden;
      display: grid;
      place-items: center;
    }
    .art.playing {
      background-image: linear-gradient(135deg, var(--warn), var(--amber));
      color: white;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .title {
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .play {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--text);
      color: var(--bg);
      border: 1px solid var(--text);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      cursor: pointer;
    }
    .play:hover {
      transform: scale(1.04);
    }
    .vol {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .vol .num {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      width: 26px;
      text-align: right;
    }
    .speakers {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .picker {
      flex: 1;
      padding: 7px 10px;
      border-radius: 9px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 12px;
    }
    .sync-btn {
      padding: 7px 12px;
      border-radius: 9px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .sync-btn:hover {
      background: var(--card-inset);
    }
    .sync-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .sync-panel {
      background: var(--card-inset);
      border-radius: 11px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 160px;
      overflow: auto;
    }
    .sync-panel::-webkit-scrollbar {
      width: 0;
    }
    .sync-row {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 6px 8px;
      border-radius: 7px;
      cursor: pointer;
      transition: background 0.1s;
    }
    .sync-row:hover {
      background: var(--card);
    }
    .check {
      width: 16px;
      height: 16px;
      border-radius: 5px;
      border: 1.5px solid var(--border);
      display: grid;
      place-items: center;
      color: white;
      flex-shrink: 0;
    }
    .check.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .row-name {
      flex: 1;
      font-size: 12px;
    }
    .row-state {
      font-size: 10px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
    .radios-head {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .radio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 8px;
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-bottom: 2px;
    }
    .radio-grid::-webkit-scrollbar {
      width: 0;
    }
    .radio {
      aspect-ratio: 1;
      border-radius: 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.12s;
      background-size: cover;
      background-position: center;
      color: var(--text);
    }
    .radio:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
    .radio .logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .radio .nm {
      font-size: 11.5px;
      font-weight: 500;
      line-height: 1.2;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .radio.playing {
      background: color-mix(in oklab, var(--accent) 22%, var(--card-inset));
      border-color: var(--accent);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;
__decorateClass$o([
  n2({ attribute: false })
], LwMediaCard.prototype, "hass", 2);
__decorateClass$o([
  n2({ attribute: false })
], LwMediaCard.prototype, "config", 2);
__decorateClass$o([
  r()
], LwMediaCard.prototype, "_selected", 2);
__decorateClass$o([
  r()
], LwMediaCard.prototype, "_syncOpen", 2);
LwMediaCard = __decorateClass$o([
  t("lw-media-card")
], LwMediaCard);
var __defProp$n = Object.defineProperty;
var __getOwnPropDesc$n = Object.getOwnPropertyDescriptor;
var __decorateClass$n = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$n(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$n(target, key, result);
  return result;
};
let LwCamerasCard = class extends i {
  constructor() {
    super(...arguments);
    this.cameras = [];
    this.cameraMotion = {};
    this._selected = null;
    this._manual = false;
    this._motionLastChanged = {};
    this._resetAuto = () => {
      this._manual = false;
    };
  }
  updated() {
    if (!this.hass) return;
    let latestCam = null;
    let latestTs = 0;
    Object.entries(this.cameraMotion).forEach(([cam, sensor]) => {
      const e2 = entityState(this.hass, sensor);
      if (!e2) return;
      const ts = Date.parse(e2.last_changed);
      if (isOn(e2.state)) {
        this._motionLastChanged[cam] = ts + 1e10;
      } else {
        this._motionLastChanged[cam] = ts;
      }
      if ((this._motionLastChanged[cam] ?? 0) > latestTs) {
        latestTs = this._motionLastChanged[cam];
        latestCam = cam;
      }
    });
    if (this._selected === null && this.cameras.length) {
      this._selected = latestCam ?? this.cameras[0];
    }
    if (!this._manual && latestCam && this._selected !== latestCam) {
      this._selected = latestCam;
    }
    if (this._selected && !this.cameras.includes(this._selected)) {
      this._selected = this.cameras[0] ?? null;
    }
  }
  _pick(cam) {
    this._manual = true;
    this._selected = cam;
  }
  _hasMotion(cam) {
    const sensor = this.cameraMotion?.[cam];
    if (!sensor) return false;
    const e2 = entityState(this.hass, sensor);
    return e2 ? isOn(e2.state) : false;
  }
  _imgFor(cam) {
    const e2 = entityState(this.hass, cam);
    return e2?.attributes?.entity_picture;
  }
  render() {
    if (!this.cameras.length) {
      return b`<div class="card">
        <lw-section-head sub="Live" heading="Kameras"></lw-section-head>
        <div class="empty">Keine Kameras konfiguriert</div>
      </div>`;
    }
    const cam = this._selected ?? this.cameras[0];
    const e2 = entityState(this.hass, cam);
    const online = e2 && e2.state !== "unavailable" && e2.state !== "unknown";
    const img = this._imgFor(cam);
    const name = friendlyName(e2, cam.split(".")[1]);
    const motionOnHere = this._hasMotion(cam);
    return b`
      <div class="card">
        <lw-section-head sub=${`Live · ${this.cameras.length} Kameras`} heading="Kameras">
          ${this._manual ? b`<button slot="right" class="auto-tag" @click=${this._resetAuto}>
                Auto
              </button>` : A}
        </lw-section-head>

        <div class="main" style=${img ? `background-image:url(${img})` : ""}>
          <div class="vignette"></div>
          <div class="badge">
            <span class="live"></span>${online ? motionOnHere ? "MOTION" : "LIVE" : "OFFLINE"}
          </div>
          <div class="name">${name}</div>
        </div>

        <div class="selector">
          ${this.cameras.map((c2) => {
      const ce = entityState(this.hass, c2);
      const nm = friendlyName(ce, c2.split(".")[1]);
      const motion = this._hasMotion(c2);
      const active = c2 === cam;
      return b`
              <button
                class=${"pick" + (active ? " active" : "") + (motion ? " motion" : "")}
                @click=${() => this._pick(c2)}
                title=${nm}
              >
                <span class="dot"></span>${nm.length > 18 ? nm.slice(0, 16) + "…" : nm}
              </button>
            `;
    })}
        </div>
      </div>
    `;
  }
};
LwCamerasCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 12px;
      min-width: 0;
      overflow: hidden;
    }
    .main {
      flex: 1;
      min-height: 0;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      background: linear-gradient(160deg, #1a2a32 0%, #2a3a3a 60%, #3a4a3a 100%);
      border: 1px solid var(--border-soft);
      background-size: cover;
      background-position: center;
    }
    .vignette {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40%;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.55));
      pointer-events: none;
    }
    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      color: white;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .badge .live {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #e76f51;
    }
    .name {
      position: absolute;
      bottom: 10px;
      left: 12px;
      color: white;
      font-size: 13px;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    }
    .selector {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .selector::-webkit-scrollbar {
      height: 0;
    }
    .pick {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 10px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      color: var(--text-muted);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
    }
    .pick.active {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .pick .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--text-faint);
    }
    .pick.active .dot {
      background: var(--accent);
    }
    .pick.motion .dot {
      background: #e76f51;
      animation: pulse-soft 1.5s ease-in-out infinite;
    }
    @keyframes pulse-soft {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
    .auto-tag {
      font-size: 10px;
      color: var(--text-faint);
      font-family: 'Geist Mono', monospace;
    }
  `;
__decorateClass$n([
  n2({ attribute: false })
], LwCamerasCard.prototype, "hass", 2);
__decorateClass$n([
  n2({ type: Array })
], LwCamerasCard.prototype, "cameras", 2);
__decorateClass$n([
  n2({ attribute: false })
], LwCamerasCard.prototype, "cameraMotion", 2);
__decorateClass$n([
  r()
], LwCamerasCard.prototype, "_selected", 2);
__decorateClass$n([
  r()
], LwCamerasCard.prototype, "_manual", 2);
LwCamerasCard = __decorateClass$n([
  t("lw-cameras-card")
], LwCamerasCard);
var __defProp$m = Object.defineProperty;
var __getOwnPropDesc$m = Object.getOwnPropertyDescriptor;
var __decorateClass$m = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$m(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$m(target, key, result);
  return result;
};
let LwCalendarCard = class extends i {
  constructor() {
    super(...arguments);
    this._events = [];
    this._loaded = false;
    this._lastFetch = 0;
  }
  updated() {
    if (!this.entity || !this.hass) return;
    if (Date.now() - this._lastFetch < 10 * 60 * 1e3) return;
    this._lastFetch = Date.now();
    this._fetchEvents();
  }
  async _fetchEvents() {
    if (!this.hass || !this.entity) return;
    const start = /* @__PURE__ */ new Date();
    const end = new Date(start);
    end.setHours(23, 59, 59);
    try {
      const evs = await this.hass.callApi(
        "GET",
        `calendars/${this.entity}?start=${encodeURIComponent(
          start.toISOString()
        )}&end=${encodeURIComponent(end.toISOString())}`
      );
      this._events = Array.isArray(evs) ? evs : [];
      this._loaded = true;
    } catch {
      this._loaded = true;
    }
  }
  _fmtTime(iso) {
    const d2 = new Date(iso);
    if (isNaN(d2.getTime())) return "–";
    return d2.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
  _fmtDur(start, end) {
    const s2 = new Date(start);
    const e2 = new Date(end);
    const min = Math.round((e2.getTime() - s2.getTime()) / 6e4);
    if (min < 60) return `${min} min`;
    if (min % 60 === 0) return `${min / 60} h`;
    return `${Math.floor(min / 60)} h ${min % 60} min`;
  }
  render() {
    if (!this.entity) {
      return b`<div class="card">
        <lw-section-head sub="Heute" heading="Kalender"></lw-section-head>
        <div class="empty">Kein Kalender konfiguriert</div>
      </div>`;
    }
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
    return b`
      <div class="card">
        <lw-section-head
          sub=${`Heute · ${this._events.length} Termine`}
          heading="Kalender"
        >
          <span slot="right" class="date-pill">${today}</span>
        </lw-section-head>
        ${this._events.length === 0 && this._loaded ? b`<div class="empty">Keine Termine heute</div>` : b`<div class="list">
              ${this._events.map(
      (e2) => b`
                  <div class="ev">
                    <div class="time">${this._fmtTime(e2.start)}</div>
                    <div class="stripe"></div>
                    <div class="body">
                      <div class="summary">${e2.summary}</div>
                      <div class="dur">${this._fmtDur(e2.start, e2.end)}</div>
                    </div>
                  </div>
                `
    )}
            </div>`}
      </div>
    `;
  }
};
LwCalendarCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      overflow: hidden;
    }
    .ev {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 8px 4px;
      border-bottom: 1px solid var(--border-soft);
    }
    .ev:last-child {
      border-bottom: none;
    }
    .time {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      color: var(--text);
      min-width: 38px;
    }
    .stripe {
      width: 3px;
      align-self: stretch;
      border-radius: 2px;
      background: var(--accent);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .summary {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dur {
      font-size: 10.5px;
      color: var(--text-faint);
      margin-top: 1px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .date-pill {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
  `;
__decorateClass$m([
  n2({ attribute: false })
], LwCalendarCard.prototype, "hass", 2);
__decorateClass$m([
  n2({ type: String })
], LwCalendarCard.prototype, "entity", 2);
__decorateClass$m([
  r()
], LwCalendarCard.prototype, "_events", 2);
__decorateClass$m([
  r()
], LwCalendarCard.prototype, "_loaded", 2);
LwCalendarCard = __decorateClass$m([
  t("lw-calendar-card")
], LwCalendarCard);
var __defProp$l = Object.defineProperty;
var __getOwnPropDesc$l = Object.getOwnPropertyDescriptor;
var __decorateClass$l = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$l(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$l(target, key, result);
  return result;
};
let LwOverviewPage = class extends i {
  constructor() {
    super(...arguments);
    this.time = /* @__PURE__ */ new Date();
  }
  _totalLightsOn() {
    const rooms = this.config.rooms ?? {};
    let count = 0;
    Object.values(rooms).forEach((r2) => {
      r2.lights?.forEach((id) => {
        if (isOn(this.hass?.states[id]?.state ?? "off")) count++;
      });
    });
    return count;
  }
  render() {
    const ov = this.config.overview ?? {};
    const totalOn = this._totalLightsOn();
    const subtitle = `${totalOn} Lichter an · ${Object.keys(this.config.rooms ?? {}).length} Räume`;
    return b`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .subtitle=${subtitle}
          .time=${this.time}
        ></lw-topbar>

        <div class="grid">
          <lw-energy-card class="e" .hass=${this.hass} .energy=${ov.energy ?? {}}></lw-energy-card>
          <lw-weather-card class="w" .hass=${this.hass} .entity=${ov.weather}></lw-weather-card>
          <lw-infos-card class="i" .hass=${this.hass} .config=${this.config}></lw-infos-card>

          <lw-scenes-row class="scenes" .hass=${this.hass} .scenes=${ov.scenes ?? []}></lw-scenes-row>

          <lw-media-card class="m" .hass=${this.hass} .config=${this.config}></lw-media-card>
          <lw-cameras-card
            class="k"
            .hass=${this.hass}
            .cameras=${ov.cameras ?? []}
            .cameraMotion=${ov.camera_motion ?? {}}
          ></lw-cameras-card>
          <lw-calendar-card class="c" .hass=${this.hass} .entity=${ov.calendar}></lw-calendar-card>
        </div>
      </div>
    `;
  }
};
LwOverviewPage.styles = i$3`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .page {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      overflow: auto;
      animation: rise 0.35s ease-out both;
    }
    .page::-webkit-scrollbar {
      width: 0;
    }
    .page > lw-topbar {
      flex: 0 0 auto;
    }

    /* Named grid areas — no auto-flow guessing, every card is explicitly
       placed. Eliminates any chance of items spilling into the wrong row. */
    .grid {
      flex: 1;
      display: grid;
      grid-template-columns: 1.55fr 1fr 1fr;
      grid-template-rows: minmax(360px, 1.3fr) auto minmax(260px, 1fr);
      grid-template-areas:
        'e w i'
        's s s'
        'm k c';
      gap: 20px;
      min-height: 0;
    }
    .grid > * { min-width: 0; min-height: 0; }
    .grid > .e { grid-area: e; }
    .grid > .w { grid-area: w; }
    .grid > .i { grid-area: i; }
    .grid > .scenes { grid-area: s; }
    .grid > .m { grid-area: m; }
    .grid > .k { grid-area: k; }
    .grid > .c { grid-area: c; }

    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Stack on narrower screens. */
    @media (max-width: 1280px) {
      .grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: minmax(280px, auto) minmax(280px, auto) auto minmax(260px, auto) minmax(260px, auto);
        grid-template-areas:
          'e e'
          'w i'
          's s'
          'm m'
          'k c';
      }
    }
    @media (max-width: 760px) {
      .grid {
        grid-template-columns: 1fr;
        grid-template-rows: none;
        grid-template-areas: none;
        grid-auto-rows: minmax(auto, max-content);
      }
      .grid > * { grid-area: auto !important; grid-column: 1 !important; }
    }
  `;
__decorateClass$l([
  n2({ attribute: false })
], LwOverviewPage.prototype, "hass", 2);
__decorateClass$l([
  n2({ attribute: false })
], LwOverviewPage.prototype, "config", 2);
__decorateClass$l([
  n2({ attribute: false })
], LwOverviewPage.prototype, "time", 2);
LwOverviewPage = __decorateClass$l([
  t("lw-overview-page")
], LwOverviewPage);
var __defProp$k = Object.defineProperty;
var __getOwnPropDesc$k = Object.getOwnPropertyDescriptor;
var __decorateClass$k = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$k(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$k(target, key, result);
  return result;
};
let LwGauge = class extends i {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.max = 100;
    this.size = 96;
    this.stroke = 8;
    this.color = "var(--accent)";
    this.track = "var(--card-inset)";
  }
  render() {
    const r2 = (this.size - this.stroke) / 2;
    const c2 = 2 * Math.PI * r2;
    const pct = Math.max(0, Math.min(1, this.value / this.max));
    return b`
      <div class="wrap" style=${`width:${this.size}px;height:${this.size}px`}>
        <svg width=${this.size} height=${this.size}>
          <circle
            cx=${this.size / 2}
            cy=${this.size / 2}
            r=${r2}
            stroke=${this.track}
            stroke-width=${this.stroke}
            fill="none"
          ></circle>
          <circle
            class="fg"
            cx=${this.size / 2}
            cy=${this.size / 2}
            r=${r2}
            stroke=${this.color}
            stroke-width=${this.stroke}
            fill="none"
            stroke-linecap="round"
            stroke-dasharray=${c2}
            stroke-dashoffset=${c2 * (1 - pct)}
          ></circle>
        </svg>
        <div class="center"><slot></slot></div>
      </div>
    `;
  }
};
LwGauge.styles = i$3`
    :host {
      display: inline-block;
      position: relative;
    }
    .wrap {
      position: relative;
    }
    svg {
      transform: rotate(-90deg);
      display: block;
    }
    .center {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }
    circle.fg {
      transition: stroke-dashoffset 0.4s ease-out;
    }
  `;
__decorateClass$k([
  n2({ type: Number })
], LwGauge.prototype, "value", 2);
__decorateClass$k([
  n2({ type: Number })
], LwGauge.prototype, "max", 2);
__decorateClass$k([
  n2({ type: Number })
], LwGauge.prototype, "size", 2);
__decorateClass$k([
  n2({ type: Number })
], LwGauge.prototype, "stroke", 2);
__decorateClass$k([
  n2({ type: String })
], LwGauge.prototype, "color", 2);
__decorateClass$k([
  n2({ type: String })
], LwGauge.prototype, "track", 2);
LwGauge = __decorateClass$k([
  t("lw-gauge")
], LwGauge);
var __defProp$j = Object.defineProperty;
var __getOwnPropDesc$j = Object.getOwnPropertyDescriptor;
var __decorateClass$j = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$j(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$j(target, key, result);
  return result;
};
let LwStepper = class extends i {
  constructor() {
    super(...arguments);
    this.value = 21;
    this.step = 0.5;
    this.min = 5;
    this.max = 30;
    this.unit = "°C";
    this.big = false;
  }
  _emit(next) {
    const clamped = Math.max(this.min, Math.min(this.max, next));
    if (clamped === this.value) return;
    this.value = clamped;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { value: clamped }, bubbles: true, composed: true })
    );
  }
  render() {
    const sizeClass = this.big ? "big" : "sm";
    const formatted = this.value.toFixed(this.step < 1 ? 1 : 0);
    return b`
      <button @click=${() => this._emit(this.value - this.step)}>
        <lw-icon name="minus" .size=${14} .stroke=${2}></lw-icon>
      </button>
      <div class=${"v " + sizeClass}>
        ${formatted}<span class=${"u " + sizeClass}>${this.unit}</span>
      </div>
      <button @click=${() => this._emit(this.value + this.step)}>
        <lw-icon name="plus" .size=${14} .stroke=${2}></lw-icon>
      </button>
    `;
  }
};
LwStepper.styles = i$3`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    button {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    button:hover {
      background: var(--card-elev);
    }
    .v {
      font-weight: 500;
      letter-spacing: -0.02em;
      text-align: center;
      font-family: 'Geist Mono', monospace;
    }
    .v.big {
      font-size: 28px;
      min-width: 88px;
    }
    .v.sm {
      font-size: 18px;
      min-width: 60px;
    }
    .u {
      color: var(--text-muted);
      margin-left: 2px;
    }
    .u.big {
      font-size: 14px;
    }
    .u.sm {
      font-size: 11px;
    }
  `;
__decorateClass$j([
  n2({ type: Number })
], LwStepper.prototype, "value", 2);
__decorateClass$j([
  n2({ type: Number })
], LwStepper.prototype, "step", 2);
__decorateClass$j([
  n2({ type: Number })
], LwStepper.prototype, "min", 2);
__decorateClass$j([
  n2({ type: Number })
], LwStepper.prototype, "max", 2);
__decorateClass$j([
  n2({ type: String })
], LwStepper.prototype, "unit", 2);
__decorateClass$j([
  n2({ type: Boolean })
], LwStepper.prototype, "big", 2);
LwStepper = __decorateClass$j([
  t("lw-stepper")
], LwStepper);
var __defProp$i = Object.defineProperty;
var __getOwnPropDesc$i = Object.getOwnPropertyDescriptor;
var __decorateClass$i = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$i(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$i(target, key, result);
  return result;
};
let LwClimateCard = class extends i {
  _onTarget(e2) {
    if (!this.hass || !this.entity) return;
    callClimateSetTemp(this.hass, this.entity, e2.detail.value);
  }
  render() {
    const e2 = entityState(this.hass, this.entity);
    if (!e2) {
      return b`<div class="card">
        <lw-section-head sub="Klima" heading="Heizung"></lw-section-head>
        <div class="empty">Kein Climate-Entity konfiguriert</div>
      </div>`;
    }
    const current = attrNum(e2, "current_temperature", NaN);
    const target = attrNum(e2, "temperature", NaN);
    const humidity = this.humidityEntity ? attrNum(entityState(this.hass, this.humidityEntity), "state", 0) || Number(entityState(this.hass, this.humidityEntity)?.state) || 0 : attrNum(e2, "current_humidity", 0);
    const diff = current - target;
    const status = !Number.isFinite(target) ? "monitor" : diff < -0.3 ? "heizt" : diff > 0.3 ? "kühlt" : "erreicht";
    const statusLabel = {
      heizt: "heizt aktiv",
      kühlt: "kühlt",
      erreicht: "Ziel erreicht",
      monitor: "Monitor"
    }[status];
    return b`
      <div class="card">
        <lw-section-head sub="Klima" heading="Heizung & Klima">
          <span slot="right">
            <lw-pill
              color=${status === "erreicht" ? "var(--accent)" : "var(--amber)"}
              .soft=${true}
              >● ${statusLabel}</lw-pill
            >
          </span>
        </lw-section-head>

        <div class="grid">
          <div class="dial">
            <lw-gauge
              .value=${(current - 10) / 20 * 100}
              .size=${160}
              .stroke=${10}
              color="var(--amber)"
            >
              <div class="center">
                <div class="v">${Number.isFinite(current) ? current.toFixed(1) : "–"}°</div>
                <div class="l">Ist-Temperatur</div>
              </div>
            </lw-gauge>
          </div>
          <div class="right">
            ${Number.isFinite(target) ? b`
                  <div class="target">
                    <div class="lbl">Zieltemperatur</div>
                    <lw-stepper
                      .value=${target}
                      .step=${0.5}
                      .min=${5}
                      .max=${30}
                      .big=${true}
                      @change=${this._onTarget}
                    ></lw-stepper>
                  </div>
                ` : ""}
            <div class="metrics">
              <div class="metric">
                <div class="l"><lw-icon name="droplet" .size=${11}></lw-icon>Feuchte</div>
                <div class="v">${humidity ? Math.round(humidity) + "%" : "–"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
LwClimateCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 14px;
      align-items: center;
      flex: 1;
    }
    .dial {
      display: grid;
      place-items: center;
    }
    .center {
      text-align: center;
    }
    .center .v {
      font-family: 'Geist Mono', monospace;
      font-size: 38px;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .center .l {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .right {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .target {
      background: var(--card-inset);
      border-radius: 12px;
      padding: 12px;
    }
    .target .lbl {
      font-size: 10.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .metrics {
      display: flex;
      gap: 8px;
    }
    .metric {
      flex: 1;
      background: var(--card-inset);
      border-radius: 10px;
      padding: 8px 10px;
    }
    .metric .l {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--text-muted);
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }
    .metric .v {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      margin-top: 2px;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 40px 0;
      text-align: center;
    }
  `;
__decorateClass$i([
  n2({ attribute: false })
], LwClimateCard.prototype, "hass", 2);
__decorateClass$i([
  n2({ type: String })
], LwClimateCard.prototype, "entity", 2);
__decorateClass$i([
  n2({ type: String })
], LwClimateCard.prototype, "humidityEntity", 2);
LwClimateCard = __decorateClass$i([
  t("lw-climate-card")
], LwClimateCard);
var __defProp$h = Object.defineProperty;
var __getOwnPropDesc$h = Object.getOwnPropertyDescriptor;
var __decorateClass$h = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$h(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$h(target, key, result);
  return result;
};
let LwToggle = class extends i {
  constructor() {
    super(...arguments);
    this.on = false;
    this.size = "md";
  }
  _click(e2) {
    e2.stopPropagation();
    const next = !this.on;
    this.on = next;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { value: next }, bubbles: true, composed: true })
    );
  }
  render() {
    const dim = this.size === "sm" ? { w: 30, h: 18, k: 12 } : { w: 36, h: 22, k: 16 };
    const offX = 2;
    const travel = dim.w - dim.k - 4;
    return b`
      <div
        class=${"t " + (this.on ? "on" : "")}
        style=${`width:${dim.w}px;height:${dim.h}px;`}
        role="switch"
        aria-checked=${String(this.on)}
        @click=${this._click}
      >
        <div
          class="k"
          style=${`width:${dim.k}px;height:${dim.k}px;transform:translate(${offX + (this.on ? travel : 0)}px,-50%);`}
        ></div>
      </div>
    `;
  }
};
LwToggle.styles = i$3`
    :host {
      display: inline-block;
    }
    .t {
      background: var(--card-inset);
      border-radius: 999px;
      border: 1px solid var(--border);
      position: relative;
      cursor: pointer;
      transition: background 0.18s, border-color 0.18s;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0;
    }
    .t.on {
      background: var(--accent);
      border-color: var(--accent);
    }
    .k {
      background: var(--text-muted);
      border-radius: 50%;
      transition: transform 0.18s, background 0.18s;
      position: absolute;
      top: 50%;
      left: 0;
      margin: 0;
    }
    .t.on .k {
      background: var(--bg);
    }
  `;
__decorateClass$h([
  n2({ type: Boolean, reflect: true })
], LwToggle.prototype, "on", 2);
__decorateClass$h([
  n2({ type: String })
], LwToggle.prototype, "size", 2);
LwToggle = __decorateClass$h([
  t("lw-toggle")
], LwToggle);
var __defProp$g = Object.defineProperty;
var __getOwnPropDesc$g = Object.getOwnPropertyDescriptor;
var __decorateClass$g = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$g(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$g(target, key, result);
  return result;
};
let LwLightTile = class extends i {
  constructor() {
    super(...arguments);
    this.name = "Licht";
    this.on = false;
    this.brightness = 0;
    this.compact = false;
  }
  _toggle(e2) {
    this.dispatchEvent(
      new CustomEvent("lw-toggle", {
        detail: { value: e2.detail.value },
        bubbles: true,
        composed: true
      })
    );
  }
  _bright(e2) {
    this.dispatchEvent(
      new CustomEvent("lw-brightness", {
        detail: { value: e2.detail.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const padding = this.compact ? "10px 12px" : "14px";
    const nameMargin = this.compact ? 6 : 10;
    return b`
      <div class=${"tile " + (this.on ? "on" : "")} style=${`padding:${padding}`}>
        <div class="row">
          <div class=${"ico" + (this.on ? " on" : "")}>
            <lw-icon name="lightbulb" .size=${16}></lw-icon>
          </div>
          <lw-toggle .on=${this.on} size="sm" @change=${this._toggle}></lw-toggle>
        </div>
        <div class="name" style=${`margin-top:${nameMargin}px`}>${this.name}</div>
        ${!this.compact ? b`
              <div class="bottom">
                <lw-slider
                  .value=${this.brightness}
                  .accent=${this.on ? "var(--amber)" : "var(--text-muted)"}
                  @change=${this._bright}
                ></lw-slider>
                <div class="pct">${this.brightness}%</div>
              </div>
            ` : A}
      </div>
    `;
  }
};
LwLightTile.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
      cursor: pointer;
      transition: background 0.12s, border-color 0.12s;
      height: 100%;
    }
    .tile:hover {
      border-color: var(--border);
    }
    .tile.on {
      background: linear-gradient(
        180deg,
        color-mix(in oklab, var(--amber) 18%, var(--card)),
        var(--card)
      );
      border-color: color-mix(in oklab, var(--amber) 35%, var(--border));
    }
    .row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .ico {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: var(--card-inset);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--amber-soft);
      color: var(--amber);
      box-shadow: var(--on-glow);
    }
    .name {
      font-size: 13px;
      font-weight: 500;
    }
    .pct {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
      font-family: 'Geist Mono', monospace;
    }
    .bottom {
      margin-top: auto;
      padding-top: 8px;
    }
  `;
__decorateClass$g([
  n2({ type: String })
], LwLightTile.prototype, "name", 2);
__decorateClass$g([
  n2({ type: Boolean })
], LwLightTile.prototype, "on", 2);
__decorateClass$g([
  n2({ type: Number })
], LwLightTile.prototype, "brightness", 2);
__decorateClass$g([
  n2({ type: Boolean })
], LwLightTile.prototype, "compact", 2);
LwLightTile = __decorateClass$g([
  t("lw-light-tile")
], LwLightTile);
var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$f(target, key, result);
  return result;
};
const SCENE_ICON = {
  ambiente: "moon",
  ambient: "moon",
  abend: "moon",
  an: "lightbulb",
  on: "lightbulb",
  auto: "sparkle",
  hell: "sun",
  bright: "sun",
  film: "film",
  movie: "film",
  lesen: "book",
  read: "book",
  kochen: "kettle",
  cook: "kettle",
  essen: "chair",
  dinner: "chair"
};
let LwLightsCard = class extends i {
  constructor() {
    super(...arguments);
    this.lights = [];
    this.scenes = [];
    this.roomName = "";
    this._popupOpen = false;
    this._firing = null;
    this._openPopup = () => this._popupOpen = true;
    this._closePopup = () => this._popupOpen = false;
  }
  _onCount() {
    return this.lights.filter((id) => entityState(this.hass, id)?.state === "on").length;
  }
  _allOff() {
    if (!this.hass) return;
    this.lights.forEach((id) => callLightTurnOff(this.hass, id));
  }
  _runScene(id) {
    if (!this.hass) return;
    this._firing = id;
    callSceneActivate(this.hass, id);
    setTimeout(() => this._firing = null, 1e3);
  }
  _iconFor(id, name) {
    const lc = (name + " " + id).toLowerCase();
    for (const [k2, v2] of Object.entries(SCENE_ICON)) {
      if (lc.includes(k2)) return v2;
    }
    return "sparkle";
  }
  _displayName(id, friendly) {
    const room = this.roomName.toLowerCase();
    if (room && friendly.toLowerCase().startsWith(room)) {
      return friendly.slice(room.length).trim() || friendly;
    }
    const rest = id.split(".")[1] ?? id;
    const parts = rest.split("_");
    if (parts.length > 1) {
      const last = parts[parts.length - 1];
      return last.charAt(0).toUpperCase() + last.slice(1);
    }
    return friendly;
  }
  render() {
    const hasScenes = this.scenes.length > 0;
    const hasLights = this.lights.length > 0;
    if (!hasScenes && !hasLights) {
      return b`<div class="card">
        <lw-section-head sub="0" heading="Beleuchtung"></lw-section-head>
        <div class="empty">Keine Szenen oder Lichter konfiguriert</div>
      </div>`;
    }
    const count = this._onCount();
    const total = this.lights.length;
    return b`
      <div class="card">
        <lw-section-head
          sub=${total ? `${count} von ${total} an` : "Szenen"}
          heading="Beleuchtung"
        >
          <button
            slot="right"
            class="gear"
            title="Einzelsteuerung"
            @click=${this._openPopup}
          >
            <lw-icon name="sliders" .size=${15}></lw-icon>
          </button>
        </lw-section-head>

        <div class="scenes">
          ${this.scenes.map((sid) => {
      const e2 = entityState(this.hass, sid);
      const name = friendlyName(e2, sid.split(".")[1]);
      const displayName = this._displayName(sid, name);
      return b`
              <button
                class=${"btn " + (this._firing === sid ? "firing" : "")}
                @click=${() => this._runScene(sid)}
              >
                <div class="ico">
                  <lw-icon name=${this._iconFor(sid, name)} .size=${18}></lw-icon>
                </div>
                <div class="name">${displayName}</div>
              </button>
            `;
    })}
          ${hasLights ? b`
                <button class="btn off" @click=${this._allOff}>
                  <div class="ico">
                    <lw-icon name="x" .size=${18} .stroke=${2}></lw-icon>
                  </div>
                  <div class="name">Aus</div>
                </button>
              ` : A}
        </div>
      </div>

      ${this._popupOpen ? b`
            <div class="overlay" @click=${this._closePopup}>
              <div class="sheet" @click=${(e2) => e2.stopPropagation()}>
                <div class="sheet-head">
                  <div>
                    <div class="sub">Einzelsteuerung</div>
                    <div class="title">${this.roomName || "Beleuchtung"}</div>
                  </div>
                  <button class="btn-sec" @click=${this._closePopup}>Schließen</button>
                </div>

                ${hasLights ? b`
                      <div class="sheet-grid">
                        ${this.lights.map((id) => {
      const e2 = entityState(this.hass, id);
      const name = friendlyName(e2, id.split(".")[1]);
      const on = e2?.state === "on";
      const bright = brightnessPct(e2) || (on ? 100 : 0);
      return b`
                            <lw-light-tile
                              .name=${name}
                              .on=${on}
                              .brightness=${bright}
                              @lw-toggle=${(ev) => this.hass && (ev.detail.value ? callLightTurnOn(this.hass, id) : callLightTurnOff(this.hass, id))}
                              @lw-brightness=${(ev) => this.hass && callLightTurnOn(this.hass, id, ev.detail.value)}
                            ></lw-light-tile>
                          `;
    })}
                      </div>
                    ` : b`<div class="empty">Keine Lichter im Raum konfiguriert</div>`}

                <div class="sheet-actions">
                  <button class="btn-sec" @click=${this._allOff}>Alle aus</button>
                  <button
                    class="btn-pri"
                    @click=${() => {
      if (this.hass) {
        this.lights.forEach((id) => callLightTurnOn(this.hass, id));
      }
    }}
                  >
                    Alle an
                  </button>
                </div>
              </div>
            </div>
          ` : A}
    `;
  }
};
LwLightsCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 14px;
      overflow: hidden;
    }
    /* auto-fill (not auto-fit) keeps empty tracks so a lone "Aus"
       button stays its natural size instead of stretching to full width. */
    .scenes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      flex: 1;
      min-height: 0;
      align-content: center;
      justify-content: start;
    }
    .btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 16px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      color: var(--text);
      text-align: left;
      transition: background 0.18s, border-color 0.18s, transform 0.1s;
      cursor: pointer;
      min-height: 88px;
    }
    .btn:hover {
      background: var(--card);
      border-color: var(--border);
    }
    .btn:active {
      transform: scale(0.98);
    }
    .btn.firing {
      background: color-mix(in oklab, var(--amber) 24%, var(--card-inset));
      border-color: color-mix(in oklab, var(--amber) 60%, var(--border-soft));
    }
    .btn.off {
      background: var(--card-inset);
    }
    .ico {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
      border: 1px solid var(--border-soft);
    }
    .btn.firing .ico {
      background: var(--amber);
      color: white;
      border-color: var(--amber);
    }
    .name {
      font-size: 13.5px;
      font-weight: 500;
      letter-spacing: -0.005em;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .gear {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 9px;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .gear:hover {
      color: var(--text);
      background: var(--card-inset);
    }

    /* Popup overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 200;
      display: grid;
      place-items: center;
      animation: fade 0.18s ease-out both;
      padding: 24px;
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .sheet {
      background: var(--bg);
      border-radius: 20px;
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow-lg);
      padding: 22px;
      max-width: 720px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .sheet-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .sheet-head .title {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }
    .sheet-head .sub {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
    }
    .sheet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
      overflow: auto;
      padding-right: 4px;
    }
    .sheet-grid::-webkit-scrollbar {
      width: 0;
    }
    .sheet-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid var(--border-soft);
    }
    .btn-pri {
      padding: 8px 16px;
      background: var(--text);
      color: var(--bg);
      border: 1px solid var(--text);
      border-radius: 10px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-sec {
      padding: 8px 16px;
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 10px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
  `;
__decorateClass$f([
  n2({ attribute: false })
], LwLightsCard.prototype, "hass", 2);
__decorateClass$f([
  n2({ type: Array })
], LwLightsCard.prototype, "lights", 2);
__decorateClass$f([
  n2({ type: Array })
], LwLightsCard.prototype, "scenes", 2);
__decorateClass$f([
  n2({ type: String })
], LwLightsCard.prototype, "roomName", 2);
__decorateClass$f([
  r()
], LwLightsCard.prototype, "_popupOpen", 2);
__decorateClass$f([
  r()
], LwLightsCard.prototype, "_firing", 2);
LwLightsCard = __decorateClass$f([
  t("lw-lights-card")
], LwLightsCard);
var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$e(target, key, result);
  return result;
};
let LwVSlider = class extends i {
  constructor() {
    super(...arguments);
    this.value = 0;
    this.height = 90;
    this.width = 26;
    this._dragging = false;
    this._onMove = (e2) => {
      if (this._dragging) this._set(e2.clientY);
    };
    this._onUp = () => {
      if (this._dragging) {
        this._dragging = false;
        this.dispatchEvent(
          new CustomEvent("change-end", {
            detail: { value: this.value },
            bubbles: true,
            composed: true
          })
        );
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("pointermove", this._onMove);
    window.addEventListener("pointerup", this._onUp);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("pointermove", this._onMove);
    window.removeEventListener("pointerup", this._onUp);
  }
  _down(e2) {
    e2.stopPropagation();
    this._dragging = true;
    this._set(e2.clientY);
  }
  _set(clientY) {
    const r2 = this._track.getBoundingClientRect();
    let v2 = (clientY - r2.top) / r2.height * 100;
    v2 = Math.max(0, Math.min(100, v2));
    const next = Math.round(100 - v2);
    if (next !== this.value) {
      this.value = next;
      this.dispatchEvent(
        new CustomEvent("change", { detail: { value: next }, bubbles: true, composed: true })
      );
    }
  }
  render() {
    const coverPct = 100 - this.value;
    const accent = this.accent ?? "var(--text-muted)";
    return b`
      <div class="v" style=${`width:${this.width}px;height:${this.height}px`} @pointerdown=${this._down}>
        <div class="fill" style=${`height:${coverPct}%;background:${accent}`}></div>
        ${[0.2, 0.4, 0.6, 0.8].map(
      (f2) => f2 * 100 <= coverPct ? b`<div class="slat" style=${`top:${f2 * 100}%`}></div>` : null
    )}
      </div>
    `;
  }
};
LwVSlider.styles = i$3`
    :host {
      display: inline-block;
    }
    .v {
      position: relative;
      background: var(--card-inset);
      border-radius: 12px;
      cursor: pointer;
      overflow: hidden;
      touch-action: none;
    }
    .fill {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      opacity: 0.7;
    }
    .slat {
      position: absolute;
      left: 4px;
      right: 4px;
      height: 1px;
      background: rgba(255, 255, 255, 0.18);
    }
  `;
__decorateClass$e([
  n2({ type: Number })
], LwVSlider.prototype, "value", 2);
__decorateClass$e([
  n2({ type: Number })
], LwVSlider.prototype, "height", 2);
__decorateClass$e([
  n2({ type: Number })
], LwVSlider.prototype, "width", 2);
__decorateClass$e([
  n2({ type: String })
], LwVSlider.prototype, "accent", 2);
__decorateClass$e([
  e(".v")
], LwVSlider.prototype, "_track", 2);
LwVSlider = __decorateClass$e([
  t("lw-vslider")
], LwVSlider);
var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$d(target, key, result);
  return result;
};
let LwBlindsCard = class extends i {
  constructor() {
    super(...arguments);
    this.covers = [];
  }
  _set(id, position) {
    if (this.hass) callCoverSetPosition(this.hass, id, position);
  }
  render() {
    if (!this.covers.length) {
      return b`<div class="card">
        <lw-section-head sub="0" heading="Rollläden"></lw-section-head>
        <div class="empty">Keine Rollläden konfiguriert</div>
      </div>`;
    }
    const count = this.covers.length;
    return b`
      <div class="card">
        <lw-section-head
          sub=${`${count} Element${count === 1 ? "" : "e"}`}
          heading="Rollläden"
        >
          <button
            slot="right"
            class="allbtn"
            @click=${() => this.covers.forEach((id) => this._set(id, 100))}
          >
            Alle hoch
          </button>
        </lw-section-head>
        <div class="row">
          ${this.covers.map((id) => {
      const e2 = entityState(this.hass, id);
      const name = friendlyName(e2, id.split(".")[1]);
      const pos = Math.round(attrNum(e2, "current_position", 0));
      return b`
              <div class="col">
                <lw-vslider
                  .value=${pos}
                  .height=${150}
                  .width=${28}
                  accent="var(--text-muted)"
                  @change-end=${(ev) => this._set(id, ev.detail.value)}
                ></lw-vslider>
                <div class="pct">${pos}%</div>
                <div class="name">${name}</div>
                <div class="btns">
                  <button class="btn" title="Hoch" @click=${() => this._set(id, 100)}>
                    <lw-icon name="arrow-up" .size=${16} .stroke=${2}></lw-icon>
                  </button>
                  <button class="btn" title="Runter" @click=${() => this._set(id, 0)}>
                    <lw-icon name="arrow-down" .size=${16} .stroke=${2}></lw-icon>
                  </button>
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
};
LwBlindsCard.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .row {
      display: flex;
      gap: 14px;
      justify-content: space-around;
      padding-top: 6px;
    }
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .pct {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      font-weight: 500;
    }
    .name {
      font-size: 10.5px;
      color: var(--text-muted);
      text-align: center;
      max-width: 80px;
    }
    .btns {
      display: flex;
      gap: 6px;
    }
    .btn {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background 0.12s, color 0.12s, border-color 0.12s;
    }
    .btn:hover {
      color: var(--text);
      border-color: var(--border-strong);
      background: var(--card-elev);
    }
    .btn:active {
      transform: scale(0.95);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
    .allbtn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 6px 12px;
      font-size: 12.5px;
      font-weight: 500;
    }
  `;
__decorateClass$d([
  n2({ attribute: false })
], LwBlindsCard.prototype, "hass", 2);
__decorateClass$d([
  n2({ type: Array })
], LwBlindsCard.prototype, "covers", 2);
LwBlindsCard = __decorateClass$d([
  t("lw-blinds-card")
], LwBlindsCard);
var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$c(target, key, result);
  return result;
};
let LwMediaMini = class extends i {
  render() {
    const e2 = entityState(this.hass, this.entity);
    if (!this.entity || !e2) {
      return b`<div class="card">
        <lw-section-head sub="Multimedia" heading="–"></lw-section-head>
        <div class="empty">Kein Media-Player</div>
      </div>`;
    }
    const playing = e2.state === "playing";
    const title = e2.attributes.media_title ?? e2.attributes.app_name ?? "–";
    const artist = e2.attributes.media_artist ?? e2.attributes.source ?? "";
    const vol = Math.round((e2.attributes.volume_level ?? 0) * 100);
    const device = friendlyName(e2, this.entity.split(".")[1]);
    const art = e2.attributes.entity_picture;
    return b`
      <div class="card">
        <lw-section-head sub="Multimedia" heading=${device}>
          <span slot="right">
            <lw-toggle
              .on=${playing}
              @change=${(ev) => this.hass && callMediaPlay(this.hass, this.entity, ev.detail.value)}
            ></lw-toggle>
          </span>
        </lw-section-head>

        <div class="row">
          <div class=${"art " + (playing ? "on" : "")}
               style=${art ? `background-image:url(${art})` : ""}>
            ${!art ? b`<lw-icon name="music" .size=${22}></lw-icon>` : ""}
          </div>
          <div class="info">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
          </div>
        </div>

        <div class="vol">
          <lw-icon name="volume" .size=${12} style="color:var(--text-muted)"></lw-icon>
          <lw-slider
            .value=${vol}
            @change=${(ev) => this.hass && callMediaVolume(this.hass, this.entity, ev.detail.value)}
          ></lw-slider>
          <span class="vnum">${vol}</span>
        </div>

        <div class="transport">
          <button
            class="mbtn"
            @click=${() => this.hass && this.hass.callService(
      "media_player",
      "media_previous_track",
      {},
      { entity_id: this.entity }
    )}
          >
            <lw-icon name="skip-prev" .size=${14}></lw-icon>
          </button>
          <button
            class="mbtn primary"
            @click=${() => this.hass && callMediaPlay(this.hass, this.entity, !playing)}
          >
            <lw-icon name=${playing ? "pause" : "play"} .size=${14}></lw-icon>
          </button>
          <button
            class="mbtn"
            @click=${() => this.hass && this.hass.callService(
      "media_player",
      "media_next_track",
      {},
      { entity_id: this.entity }
    )}
          >
            <lw-icon name="skip-next" .size=${14}></lw-icon>
          </button>
        </div>
      </div>
    `;
  }
};
LwMediaMini.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 0;
      overflow: hidden;
    }
    .row {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .art {
      width: 52px;
      height: 52px;
      border-radius: 10px;
      background: var(--card-inset);
      color: var(--text-muted);
      flex-shrink: 0;
      display: grid;
      place-items: center;
      background-size: cover;
      background-position: center;
    }
    .art.on {
      background: linear-gradient(135deg, var(--warn), var(--amber));
      color: white;
    }
    .info {
      min-width: 0;
      flex: 1;
    }
    .title {
      font-size: 12.5px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .artist {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .vol {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }
    .vnum {
      font-family: 'Geist Mono', monospace;
      font-size: 10.5px;
      color: var(--text-muted);
      width: 22px;
    }
    .transport {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-top: 10px;
    }
    .mbtn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    .mbtn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;
__decorateClass$c([
  n2({ attribute: false })
], LwMediaMini.prototype, "hass", 2);
__decorateClass$c([
  n2({ type: String })
], LwMediaMini.prototype, "entity", 2);
LwMediaMini = __decorateClass$c([
  t("lw-media-mini")
], LwMediaMini);
var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$b(target, key, result);
  return result;
};
let LwExtraVacuum = class extends i {
  constructor() {
    super(...arguments);
    this.name = "";
  }
  _stateLabel(s2) {
    const map = {
      cleaning: "reinigt",
      docked: "lädt",
      returning: "fährt zurück",
      paused: "pausiert",
      error: "Fehler",
      idle: "bereit"
    };
    return map[s2.toLowerCase()] ?? s2;
  }
  _call(service) {
    if (!this.hass) return;
    void this.hass.callService("vacuum", service, {}, { entity_id: this.entity });
  }
  render() {
    const e2 = entityState(this.hass, this.entity);
    const state = e2?.state ?? "unknown";
    const battery = Math.round(attrNum(e2, "battery_level", NaN));
    const cleaning = ["cleaning", "returning", "paused"].includes(state.toLowerCase());
    const displayName = this.name || friendlyName(e2, this.entity.split(".")[1]);
    return b`
      <div class=${"tile" + (cleaning ? " cleaning" : "")}>
        <div class="head">
          <div class=${"ico" + (cleaning ? " cleaning" : "")}>
            <lw-icon name="vacuum" .size=${16}></lw-icon>
          </div>
          ${Number.isFinite(battery) ? b`<span class=${"battery" + (battery <= 20 ? " low" : "")}>
                <lw-icon name="bolt" .size=${10}></lw-icon>${battery}%
              </span>` : ""}
        </div>
        <div>
          <div class="name">${displayName}</div>
          <div class="state">${this._stateLabel(state)}</div>
        </div>
        <div class="actions">
          ${cleaning ? b`
                <button class="btn" @click=${() => this._call("pause")}>
                  <lw-icon name="pause" .size=${12}></lw-icon>Pause
                </button>
                <button class="btn primary" @click=${() => this._call("return_to_base")}>
                  Dock
                </button>
              ` : b`
                <button class="btn primary" @click=${() => this._call("start")}>
                  <lw-icon name="play" .size=${12}></lw-icon>Start
                </button>
                <button class="btn" @click=${() => this._call("locate")}>
                  <lw-icon name="sound" .size=${12}></lw-icon>
                </button>
              `}
        </div>
      </div>
    `;
  }
};
LwExtraVacuum.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 13px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 110px;
      height: 100%;
    }
    .tile.cleaning {
      background: color-mix(in oklab, var(--accent) 12%, var(--card-inset));
      border-color: color-mix(in oklab, var(--accent) 45%, var(--border-soft));
    }
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.cleaning {
      background: var(--accent);
      color: white;
    }
    .battery {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
    .battery.low {
      color: var(--warn);
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .state {
      font-size: 10.5px;
      color: var(--text-muted);
    }
    .actions {
      display: flex;
      gap: 6px;
      margin-top: auto;
    }
    .btn {
      flex: 1;
      padding: 7px;
      border-radius: 8px;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .btn:hover {
      background: var(--card-elev);
    }
    .btn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
  `;
__decorateClass$b([
  n2({ attribute: false })
], LwExtraVacuum.prototype, "hass", 2);
__decorateClass$b([
  n2({ type: String })
], LwExtraVacuum.prototype, "entity", 2);
__decorateClass$b([
  n2({ type: String })
], LwExtraVacuum.prototype, "name", 2);
LwExtraVacuum = __decorateClass$b([
  t("lw-extra-vacuum")
], LwExtraVacuum);
var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$a(target, key, result);
  return result;
};
let LwExtraMower = class extends i {
  constructor() {
    super(...arguments);
    this.name = "";
  }
  _stateLabel(s2) {
    const map = {
      mowing: "mäht",
      docked: "in Station",
      returning: "fährt zurück",
      paused: "pausiert",
      error: "Fehler",
      idle: "bereit",
      charging: "lädt"
    };
    return map[s2.toLowerCase()] ?? s2;
  }
  _call(service) {
    if (!this.hass) return;
    const domain = this.entity.split(".")[0];
    void this.hass.callService(domain, service, {}, { entity_id: this.entity });
  }
  render() {
    const e2 = entityState(this.hass, this.entity);
    const state = e2?.state ?? "unknown";
    const battery = Math.round(attrNum(e2, "battery_level", NaN));
    const mowing = ["mowing", "returning"].includes(state.toLowerCase());
    const displayName = this.name || friendlyName(e2, this.entity.split(".")[1]);
    return b`
      <div class=${"tile" + (mowing ? " mowing" : "")}>
        <div class="head">
          <div class=${"ico" + (mowing ? " mowing" : "")}>
            <lw-icon name="leaf" .size=${16}></lw-icon>
          </div>
          ${Number.isFinite(battery) ? b`<span class=${"battery" + (battery <= 20 ? " low" : "")}>
                <lw-icon name="bolt" .size=${10}></lw-icon>${battery}%
              </span>` : ""}
        </div>
        <div>
          <div class="name">${displayName}</div>
          <div class="state">${this._stateLabel(state)}</div>
        </div>
        <div class="actions">
          ${mowing ? b`<button class="btn" @click=${() => this._call("pause")}>Pause</button>
                <button class="btn primary" @click=${() => this._call("dock")}>Dock</button>` : b`<button class="btn primary" @click=${() => this._call("start_mowing")}>Start</button>
                <button class="btn" @click=${() => this._call("dock")}>Dock</button>`}
        </div>
      </div>
    `;
  }
};
LwExtraMower.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 13px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 110px;
      height: 100%;
    }
    .tile.mowing {
      background: color-mix(in oklab, var(--accent) 12%, var(--card-inset));
      border-color: color-mix(in oklab, var(--accent) 45%, var(--border-soft));
    }
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.mowing {
      background: var(--accent);
      color: white;
    }
    .battery {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }
    .battery.low {
      color: var(--warn);
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .state {
      font-size: 10.5px;
      color: var(--text-muted);
    }
    .actions {
      display: flex;
      gap: 6px;
      margin-top: auto;
    }
    .btn {
      flex: 1;
      padding: 7px;
      border-radius: 8px;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn:hover {
      background: var(--card-elev);
    }
    .btn.primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
  `;
__decorateClass$a([
  n2({ attribute: false })
], LwExtraMower.prototype, "hass", 2);
__decorateClass$a([
  n2({ type: String })
], LwExtraMower.prototype, "entity", 2);
__decorateClass$a([
  n2({ type: String })
], LwExtraMower.prototype, "name", 2);
LwExtraMower = __decorateClass$a([
  t("lw-extra-mower")
], LwExtraMower);
var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$9(target, key, result);
  return result;
};
let LwExtraSprinkler = class extends i {
  constructor() {
    super(...arguments);
    this.name = "";
  }
  _subText() {
    const stE = entityState(this.hass, this.state_entity);
    if (!stE) return "";
    const unit = stE.attributes.unit_of_measurement ?? "";
    return `${stE.state}${unit ? " " + unit : ""}`;
  }
  _start() {
    if (!this.hass) return;
    callToggle(this.hass, this.entity);
  }
  render() {
    const e2 = entityState(this.hass, this.entity);
    const on = e2 ? isOn(e2.state) : false;
    const displayName = this.name || friendlyName(e2, this.entity.split(".")[1]);
    const sub = this._subText();
    return b`
      <div class=${"tile" + (on ? " on" : "")}>
        <div class="head">
          <div class=${"ico" + (on ? " on" : "")}>
            <lw-icon name="water" .size=${16}></lw-icon>
          </div>
          <span class=${"pill" + (on ? " on" : "")}>${on ? "LÄUFT" : "AUS"}</span>
        </div>
        <div>
          <div class="name">${displayName}</div>
          ${sub ? b`<div class="sub">${sub}</div>` : ""}
        </div>
        <div class="actions">
          <button
            class=${"btn" + (on ? "" : " primary")}
            @click=${this._start}
          >
            ${on ? "Stop" : "Start"}
          </button>
        </div>
      </div>
    `;
  }
};
LwExtraSprinkler.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 13px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 110px;
      height: 100%;
    }
    .tile.on {
      background: color-mix(in oklab, var(--blue) 18%, var(--card-inset));
      border-color: color-mix(in oklab, var(--blue) 50%, var(--border-soft));
    }
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--blue);
      color: white;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .pill {
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--card);
      font-size: 10px;
      font-family: 'Geist Mono', monospace;
      color: var(--text-muted);
    }
    .pill.on {
      background: var(--blue);
      color: white;
    }
    .actions {
      display: flex;
      gap: 6px;
      margin-top: auto;
    }
    .btn {
      flex: 1;
      padding: 7px;
      border-radius: 8px;
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      font: inherit;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn.primary {
      background: var(--blue);
      color: white;
      border-color: var(--blue);
    }
  `;
__decorateClass$9([
  n2({ attribute: false })
], LwExtraSprinkler.prototype, "hass", 2);
__decorateClass$9([
  n2({ type: String })
], LwExtraSprinkler.prototype, "entity", 2);
__decorateClass$9([
  n2({ type: String })
], LwExtraSprinkler.prototype, "name", 2);
__decorateClass$9([
  n2({ type: String })
], LwExtraSprinkler.prototype, "state_entity", 2);
LwExtraSprinkler = __decorateClass$9([
  t("lw-extra-sprinkler")
], LwExtraSprinkler);
var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$8(target, key, result);
  return result;
};
let LwExtraFan = class extends i {
  constructor() {
    super(...arguments);
    this.name = "";
    this.icon = "fan";
    this.tint = "var(--accent)";
  }
  _sub() {
    const stE = entityState(this.hass, this.state_entity);
    if (!stE) return "";
    const v2 = parseFloat(stE.state);
    const unit = stE.attributes.unit_of_measurement ?? "";
    if (Number.isFinite(v2) && unit) return `${Math.round(v2)} ${unit}`;
    return `${stE.state}${unit ? " " + unit : ""}`;
  }
  render() {
    this.style.setProperty("--tint", this.tint);
    const e2 = entityState(this.hass, this.entity);
    const on = e2 ? isOn(e2.state) : false;
    const displayName = this.name || friendlyName(e2, this.entity.split(".")[1]);
    const sub = this._sub();
    return b`
      <div class=${"tile" + (on ? " on" : "")}>
        <div class="head">
          <div class=${"ico" + (on ? " on" : "")}>
            <lw-icon name=${this.icon} .size=${16}></lw-icon>
          </div>
          <lw-toggle
            .on=${on}
            size="sm"
            @change=${() => this.hass && callToggle(this.hass, this.entity)}
          ></lw-toggle>
        </div>
        <div class="body">
          <div class="name">${displayName}</div>
          <div class="sub">${sub || (on ? "An" : "Aus")}</div>
        </div>
      </div>
    `;
  }
};
LwExtraFan.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      border-radius: 13px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 110px;
      height: 100%;
    }
    .tile.on {
      background: color-mix(in oklab, var(--tint) 14%, var(--card-inset));
      border-color: color-mix(in oklab, var(--tint) 45%, var(--border-soft));
    }
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--tint);
      color: white;
    }
    .body {
      margin-top: auto;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
  `;
__decorateClass$8([
  n2({ attribute: false })
], LwExtraFan.prototype, "hass", 2);
__decorateClass$8([
  n2({ type: String })
], LwExtraFan.prototype, "entity", 2);
__decorateClass$8([
  n2({ type: String })
], LwExtraFan.prototype, "name", 2);
__decorateClass$8([
  n2({ type: String })
], LwExtraFan.prototype, "state_entity", 2);
__decorateClass$8([
  n2({ type: String })
], LwExtraFan.prototype, "icon", 2);
__decorateClass$8([
  n2({ type: String })
], LwExtraFan.prototype, "tint", 2);
LwExtraFan = __decorateClass$8([
  t("lw-extra-fan")
], LwExtraFan);
var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$7(target, key, result);
  return result;
};
let LwFeatureTile = class extends i {
  constructor() {
    super(...arguments);
    this.icon = "cog";
    this.name = "";
    this.sub = "";
    this.on = false;
    this.tint = "var(--amber)";
  }
  render() {
    this.style.setProperty("--tint", this.tint);
    return b`
      <div class=${"tile " + (this.on ? "on" : "")}>
        <div class="row">
          <div class=${"ico" + (this.on ? " on" : "")}>
            <lw-icon name=${this.icon} .size=${15}></lw-icon>
          </div>
          <span class=${"dot" + (this.on ? " on" : "")}></span>
        </div>
        <div>
          <div class="name">${this.name}</div>
          <div class="sub">${this.sub}</div>
        </div>
      </div>
    `;
  }
};
LwFeatureTile.styles = i$3`
    :host {
      display: block;
    }
    .tile {
      border-radius: 12px;
      padding: 12px;
      background: var(--card-inset);
      border: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 80px;
      height: 100%;
    }
    .tile.on {
      background: color-mix(in oklab, var(--tint, var(--amber)) 14%, var(--card-inset));
      border-color: color-mix(in oklab, var(--tint, var(--amber)) 35%, var(--border-soft));
    }
    .row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .ico {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: var(--card);
      color: var(--text-muted);
      display: grid;
      place-items: center;
    }
    .ico.on {
      background: var(--tint, var(--amber));
      color: white;
    }
    .name {
      font-size: 12.5px;
      font-weight: 500;
    }
    .sub {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-faint);
    }
    .dot.on {
      background: var(--tint, var(--amber));
    }
  `;
__decorateClass$7([
  n2({ type: String })
], LwFeatureTile.prototype, "icon", 2);
__decorateClass$7([
  n2({ type: String })
], LwFeatureTile.prototype, "name", 2);
__decorateClass$7([
  n2({ type: String })
], LwFeatureTile.prototype, "sub", 2);
__decorateClass$7([
  n2({ type: Boolean })
], LwFeatureTile.prototype, "on", 2);
__decorateClass$7([
  n2({ type: String })
], LwFeatureTile.prototype, "tint", 2);
LwFeatureTile = __decorateClass$7([
  t("lw-feature-tile")
], LwFeatureTile);
var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$6(target, key, result);
  return result;
};
let LwRoomExtras = class extends i {
  constructor() {
    super(...arguments);
    this.extras = [];
    this.heading = "Geräte";
    this.sub = "Räumlich";
  }
  _renderExtra(x2) {
    if (!x2.entity) return A;
    switch (x2.kind) {
      case "vacuum":
        return b`<lw-extra-vacuum
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
        ></lw-extra-vacuum>`;
      case "mower":
        return b`<lw-extra-mower
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
        ></lw-extra-mower>`;
      case "irrigation":
        return b`<lw-extra-sprinkler
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
        ></lw-extra-sprinkler>`;
      case "air-purifier":
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="wind"
          tint="var(--accent)"
        ></lw-extra-fan>`;
      case "dehumidifier":
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="droplet"
          tint="var(--blue)"
        ></lw-extra-fan>`;
      case "fan":
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="fan"
          tint="var(--accent)"
        ></lw-extra-fan>`;
      case "fireplace":
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="fire"
          tint="var(--warn)"
        ></lw-extra-fan>`;
      case "tv":
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="tv"
          tint="var(--amber)"
        ></lw-extra-fan>`;
      default:
        return b`<lw-extra-fan
          .hass=${this.hass}
          .entity=${x2.entity}
          .name=${x2.name}
          .state_entity=${x2.state_entity}
          icon="cog"
          tint="var(--text-muted)"
        ></lw-extra-fan>`;
    }
  }
  render() {
    if (!this.extras.length) {
      return b`<div class="card">
        <lw-section-head sub=${this.sub} heading=${this.heading}></lw-section-head>
        <div class="empty">Keine Geräte konfiguriert</div>
      </div>`;
    }
    return b`
      <div class="card">
        <lw-section-head sub=${this.sub} heading=${this.heading}></lw-section-head>
        <div class="grid">${this.extras.map((x2) => this._renderExtra(x2))}</div>
      </div>
    `;
  }
};
LwRoomExtras.styles = i$3`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-auto-rows: minmax(110px, auto);
      align-content: start;
      gap: 8px;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
    .grid::-webkit-scrollbar {
      width: 0;
    }
    .empty {
      color: var(--text-muted);
      font-size: 12px;
      padding: 24px 0;
      text-align: center;
    }
  `;
__decorateClass$6([
  n2({ attribute: false })
], LwRoomExtras.prototype, "hass", 2);
__decorateClass$6([
  n2({ type: Array })
], LwRoomExtras.prototype, "extras", 2);
__decorateClass$6([
  n2({ type: String })
], LwRoomExtras.prototype, "heading", 2);
__decorateClass$6([
  n2({ type: String })
], LwRoomExtras.prototype, "sub", 2);
LwRoomExtras = __decorateClass$6([
  t("lw-room-extras")
], LwRoomExtras);
var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$5(target, key, result);
  return result;
};
let LwRoomPage = class extends i {
  constructor() {
    super(...arguments);
    this.roomKey = "";
    this.time = /* @__PURE__ */ new Date();
  }
  get _room() {
    return this.config.rooms?.[this.roomKey];
  }
  _subtitle(room) {
    const lightsOn = (room.lights ?? []).filter(
      (id) => entityState(this.hass, id)?.state === "on"
    ).length;
    const lightsTotal = (room.lights ?? []).length;
    const climateE = entityState(this.hass, room.climate);
    const temp = attrNum(climateE, "current_temperature", NaN);
    const humidity = attrNum(climateE, "current_humidity", NaN);
    const bits = [];
    if (lightsTotal) bits.push(`${lightsOn}/${lightsTotal} Lichter`);
    if (Number.isFinite(temp)) bits.push(`${temp.toFixed(1)}°C`);
    if (Number.isFinite(humidity)) bits.push(`${Math.round(humidity)}% Feuchte`);
    return bits.join(" · ") || "Keine Sensoren konfiguriert";
  }
  render() {
    const room = this._room;
    if (!room) {
      return b`<div class="page">
        <div>Raum „${this.roomKey}" nicht in Config gefunden.</div>
      </div>`;
    }
    const hasClimate = !!room.climate;
    const hasLights = !!(room.lights?.length || room.scenes?.length);
    const hasExtras = !!room.extras?.length;
    const hasCovers = !!room.covers?.length;
    const hasMedia = !!room.media_player;
    const topRow = (() => {
      if (hasClimate && hasLights) {
        return b`<div class="row top">
          <div class="col-1">
            <lw-climate-card .hass=${this.hass} .entity=${room.climate}></lw-climate-card>
          </div>
          <div class="col-1-5">
            <lw-lights-card
              .hass=${this.hass}
              .lights=${room.lights ?? []}
              .scenes=${room.scenes ?? []}
              .roomName=${room.name}
            ></lw-lights-card>
          </div>
        </div>`;
      }
      if (hasClimate) {
        return b`<div class="row top">
          <div class="col-2">
            <lw-climate-card .hass=${this.hass} .entity=${room.climate}></lw-climate-card>
          </div>
        </div>`;
      }
      if (hasLights) {
        return b`<div class="row top">
          <div class="col-2">
            <lw-lights-card
              .hass=${this.hass}
              .lights=${room.lights ?? []}
              .scenes=${room.scenes ?? []}
              .roomName=${room.name}
            ></lw-lights-card>
          </div>
        </div>`;
      }
      return A;
    })();
    const bottomRightHasBoth = hasCovers && hasMedia;
    const bottomRight = bottomRightHasBoth ? b`<div class="row" style="gap:12px; flex:1; min-height:0">
          <div class="col-1">
            <lw-blinds-card .hass=${this.hass} .covers=${room.covers}></lw-blinds-card>
          </div>
          <div class="col-1">
            <lw-media-mini .hass=${this.hass} .entity=${room.media_player}></lw-media-mini>
          </div>
        </div>` : hasCovers ? b`<lw-blinds-card .hass=${this.hass} .covers=${room.covers}></lw-blinds-card>` : hasMedia ? b`<lw-media-mini .hass=${this.hass} .entity=${room.media_player}></lw-media-mini>` : A;
    const bottomRow = (() => {
      if (hasExtras && bottomRight !== A) {
        return b`<div class="row bottom">
          <div class="col-1">
            <lw-room-extras
              .hass=${this.hass}
              .extras=${room.extras ?? []}
              heading="Geräte"
              sub="Räumlich"
            ></lw-room-extras>
          </div>
          <div class="col-1-5">${bottomRight}</div>
        </div>`;
      }
      if (hasExtras) {
        return b`<div class="row bottom">
          <div class="col-2">
            <lw-room-extras
              .hass=${this.hass}
              .extras=${room.extras ?? []}
              heading="Geräte"
              sub="Räumlich"
            ></lw-room-extras>
          </div>
        </div>`;
      }
      if (bottomRight !== A) {
        return b`<div class="row bottom">
          <div class="col-2">${bottomRight}</div>
        </div>`;
      }
      return A;
    })();
    return b`
      <div class="page">
        <lw-topbar
          .hass=${this.hass}
          .config=${this.config}
          .heading=${room.name}
          .subtitle=${this._subtitle(room)}
          .time=${this.time}
        ></lw-topbar>

        ${topRow}
        ${bottomRow}
      </div>
    `;
  }
};
LwRoomPage.styles = i$3`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .page {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
      animation: rise 0.35s ease-out both;
    }
    /* Each row is a flex container. Cards have flex weights but only the cards
       that actually have data are rendered. So if a room has no climate, the
       lights card takes the whole row instead of leaving an empty 1fr cell. */
    .row {
      display: flex;
      gap: 12px;
      min-height: 0;
    }
    .row.top {
      flex: 1.1;
    }
    .row.bottom {
      flex: 1;
    }
    .col-1 { flex: 1; min-width: 0; }
    .col-1-5 { flex: 1.5; min-width: 0; }
    .col-2 { flex: 2; min-width: 0; }
    .row > * { min-width: 0; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 900px) {
      .row { flex-direction: column; }
      .col-1, .col-1-5, .col-2 { flex: none; }
    }
  `;
__decorateClass$5([
  n2({ attribute: false })
], LwRoomPage.prototype, "hass", 2);
__decorateClass$5([
  n2({ attribute: false })
], LwRoomPage.prototype, "config", 2);
__decorateClass$5([
  n2({ type: String })
], LwRoomPage.prototype, "roomKey", 2);
__decorateClass$5([
  n2({ attribute: false })
], LwRoomPage.prototype, "time", 2);
LwRoomPage = __decorateClass$5([
  t("lw-room-page")
], LwRoomPage);
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
let LwEntityPicker = class extends i {
  constructor() {
    super(...arguments);
    this.value = "";
    this.placeholder = "Entity wählen…";
    this.domains = [];
    this.allowEmpty = true;
    this.compact = false;
    this._open = false;
    this._filter = "";
    this._onClick = (e2) => {
      const path = e2.composedPath();
      if (!path.includes(this)) {
        this._open = false;
      }
    };
  }
  _options() {
    if (!this.hass) return [];
    const filter = this._filter.toLowerCase();
    return Object.values(this.hass.states).filter((s2) => {
      if (this.domains.length && !this.domains.some((d2) => s2.entity_id.startsWith(d2 + "."))) {
        return false;
      }
      if (!filter) return true;
      const name = (s2.attributes.friendly_name ?? "").toLowerCase();
      return s2.entity_id.toLowerCase().includes(filter) || name.includes(filter);
    }).map((s2) => ({
      id: s2.entity_id,
      name: s2.attributes.friendly_name ?? s2.entity_id
    })).sort((a2, b2) => a2.name.localeCompare(b2.name)).slice(0, 200);
  }
  _selectedLabel() {
    if (!this.value) return "";
    const e2 = this.hass?.states[this.value];
    return e2 ? `${e2.attributes.friendly_name ?? this.value}` : this.value;
  }
  _emit(value) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { value }, bubbles: true, composed: true })
    );
  }
  _pick(id) {
    this._emit(id);
    this._open = false;
    this._filter = "";
  }
  _clear(e2) {
    e2.stopPropagation();
    this._emit("");
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._onClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._onClick);
  }
  render() {
    const opts = this._open ? this._options() : [];
    this._selectedLabel() || this._filter;
    return b`
      <div class="wrap">
        <input
          class="input"
          .value=${this._open ? this._filter : this._selectedLabel()}
          placeholder=${this.placeholder}
          @click=${() => this._open = true}
          @focus=${() => this._open = true}
          @input=${(e2) => {
      this._filter = e2.target.value;
      this._open = true;
    }}
        />
        ${this.value && this.allowEmpty ? b`<button class="clear" @click=${this._clear}>
              <lw-icon name="x" .size=${12} .stroke=${2}></lw-icon>
            </button>` : ""}
        <span class="chevron"><lw-icon name="arrow-down" .size=${12}></lw-icon></span>
        ${this._open ? b`<div class="menu">
              ${opts.length === 0 ? b`<div class="empty">Keine Treffer</div>` : opts.map(
      (o2) => b`
                      <div
                        class=${"opt" + (o2.id === this.value ? " selected" : "")}
                        @click=${() => this._pick(o2.id)}
                      >
                        <div>${o2.name}</div>
                        <div class="id">${o2.id}</div>
                      </div>
                    `
    )}
            </div>` : ""}
      </div>
    `;
  }
};
LwEntityPicker.styles = i$3`
    :host {
      display: block;
      position: relative;
    }
    .wrap {
      position: relative;
    }
    .input {
      width: 100%;
      padding: 8px 32px 8px 12px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    :host([compact]) .input {
      padding: 6px 28px 6px 10px;
      font-size: 12px;
      border-radius: 7px;
    }
    .input:focus {
      outline: none;
      border-color: var(--accent);
    }
    .clear,
    .chevron {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: grid;
      place-items: center;
    }
    .clear {
      right: 22px;
    }
    .chevron {
      right: 4px;
      pointer-events: none;
    }
    .menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: var(--shadow-lg);
      max-height: 280px;
      overflow: auto;
      z-index: 50;
    }
    .menu::-webkit-scrollbar {
      width: 0;
    }
    .opt {
      padding: 8px 12px;
      font-size: 12.5px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .opt:hover {
      background: var(--card-inset);
    }
    .opt.selected {
      background: color-mix(in oklab, var(--accent) 14%, transparent);
    }
    .opt .id {
      font-size: 10.5px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }
    .empty {
      padding: 16px;
      color: var(--text-muted);
      font-size: 12px;
      text-align: center;
    }
  `;
__decorateClass$4([
  n2({ attribute: false })
], LwEntityPicker.prototype, "hass", 2);
__decorateClass$4([
  n2({ type: String })
], LwEntityPicker.prototype, "value", 2);
__decorateClass$4([
  n2({ type: String })
], LwEntityPicker.prototype, "placeholder", 2);
__decorateClass$4([
  n2({ type: Array })
], LwEntityPicker.prototype, "domains", 2);
__decorateClass$4([
  n2({ type: Boolean })
], LwEntityPicker.prototype, "allowEmpty", 2);
__decorateClass$4([
  n2({ type: Boolean })
], LwEntityPicker.prototype, "compact", 2);
__decorateClass$4([
  r()
], LwEntityPicker.prototype, "_open", 2);
__decorateClass$4([
  r()
], LwEntityPicker.prototype, "_filter", 2);
__decorateClass$4([
  e(".input")
], LwEntityPicker.prototype, "_input", 2);
LwEntityPicker = __decorateClass$4([
  t("lw-entity-picker")
], LwEntityPicker);
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
let LwEntityMulti = class extends i {
  constructor() {
    super(...arguments);
    this.value = [];
    this.domains = [];
    this.placeholder = "Entity hinzufügen…";
  }
  _add(e2) {
    const id = e2.detail.value;
    if (!id || this.value.includes(id)) return;
    this._emit([...this.value, id]);
    const picker = this.renderRoot.querySelector("lw-entity-picker");
    if (picker) picker.value = "";
  }
  _remove(id) {
    this._emit(this.value.filter((v2) => v2 !== id));
  }
  _emit(next) {
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("change", { detail: { value: next }, bubbles: true, composed: true })
    );
  }
  _name(id) {
    const e2 = this.hass?.states[id];
    return friendlyName(e2, id);
  }
  render() {
    return b`
      ${this.value.length === 0 ? b`<div class="empty">— noch nichts gewählt —</div>` : b`<div class="chips">
            ${this.value.map(
      (id) => b`
                <span class="chip">
                  <span class="nm" title=${id}>${this._name(id)}</span>
                  <button @click=${() => this._remove(id)}>
                    <lw-icon name="x" .size=${10} .stroke=${2.5}></lw-icon>
                  </button>
                </span>
              `
    )}
          </div>`}
      <lw-entity-picker
        .hass=${this.hass}
        .domains=${this.domains}
        placeholder=${this.placeholder}
        value=""
        @change=${this._add}
      ></lw-entity-picker>
    `;
  }
};
LwEntityMulti.styles = i$3`
    :host {
      display: block;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px 5px 10px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 12px;
      max-width: 100%;
    }
    .chip .nm {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
    }
    .chip button {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: transparent;
      border: none;
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
    }
    .chip button:hover {
      color: var(--warn);
      background: color-mix(in oklab, var(--warn) 12%, transparent);
    }
    .empty {
      font-size: 11.5px;
      color: var(--text-faint);
      margin-bottom: 8px;
    }
  `;
__decorateClass$3([
  n2({ attribute: false })
], LwEntityMulti.prototype, "hass", 2);
__decorateClass$3([
  n2({ type: Array })
], LwEntityMulti.prototype, "value", 2);
__decorateClass$3([
  n2({ type: Array })
], LwEntityMulti.prototype, "domains", 2);
__decorateClass$3([
  n2({ type: String })
], LwEntityMulti.prototype, "placeholder", 2);
LwEntityMulti = __decorateClass$3([
  t("lw-entity-multi")
], LwEntityMulti);
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let LwTextInput = class extends i {
  constructor() {
    super(...arguments);
    this.value = "";
    this.placeholder = "";
    this.type = "text";
  }
  render() {
    return b`<input
      type=${this.type}
      .value=${this.value ?? ""}
      placeholder=${this.placeholder}
      @input=${(e2) => this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: e2.target.value },
        bubbles: true,
        composed: true
      })
    )}
    />`;
  }
};
LwTextInput.styles = i$3`
    :host {
      display: block;
    }
    input {
      width: 100%;
      padding: 8px 12px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
    }
  `;
__decorateClass$2([
  n2({ type: String })
], LwTextInput.prototype, "value", 2);
__decorateClass$2([
  n2({ type: String })
], LwTextInput.prototype, "placeholder", 2);
__decorateClass$2([
  n2({ type: String })
], LwTextInput.prototype, "type", 2);
LwTextInput = __decorateClass$2([
  t("lw-text-input")
], LwTextInput);
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
const ROOM_ICONS = [
  "sofa",
  "kettle",
  "bed",
  "shower",
  "desk",
  "chair",
  "door",
  "tree",
  "cog",
  "home",
  "fire",
  "garage",
  "plant",
  "water"
];
const EXTRA_KINDS = [
  { id: "vacuum", label: "Saugroboter", icon: "vacuum" },
  { id: "mower", label: "Mähroboter", icon: "leaf" },
  { id: "irrigation", label: "Sprinkler (Smart Irrigation)", icon: "water" },
  { id: "air-purifier", label: "Luftreiniger", icon: "wind" },
  { id: "dehumidifier", label: "Luftentfeuchter", icon: "droplet" },
  { id: "fan", label: "Lüfter", icon: "fan" },
  { id: "fireplace", label: "Kamin", icon: "fire" },
  { id: "tv", label: "TV", icon: "tv" },
  { id: "generic", label: "Sonstiges (Schalter)", icon: "cog" }
];
let LwEditPage = class extends i {
  constructor() {
    super(...arguments);
    this.config = DEFAULT_CONFIG;
    this._tab = "allgemein";
    this._expandedRoom = null;
    this._close = () => {
      this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
    };
  }
  _update(patch) {
    const next = typeof patch === "function" ? patch(this.config) : { ...this.config, ...patch };
    this.config = next;
    configStore.set(next);
  }
  _patchOverview(key, value) {
    this._update((c2) => ({ ...c2, overview: { ...c2.overview, [key]: value } }));
  }
  _patchRoom(key, patch) {
    this._update((c2) => ({
      ...c2,
      rooms: {
        ...c2.rooms,
        [key]: { ...c2.rooms[key] ?? { name: key }, ...patch }
      }
    }));
  }
  _deleteRoom(key) {
    if (!confirm(`Raum „${this.config.rooms[key]?.name ?? key}" wirklich löschen?`)) return;
    this._update((c2) => {
      const r2 = { ...c2.rooms };
      delete r2[key];
      return { ...c2, rooms: r2 };
    });
  }
  _addRoom() {
    const key = prompt("Raum-ID (z.B. wohnzimmer, draussen):")?.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!key) return;
    if (this.config.rooms[key]) {
      alert("Raum existiert bereits");
      return;
    }
    const name = prompt("Anzeigename:", key.charAt(0).toUpperCase() + key.slice(1))?.trim() ?? key;
    this._patchRoom(key, { name, icon: "cog" });
    this._expandedRoom = key;
  }
  // ---------- Tab: Allgemein ----------
  _renderGeneral() {
    return b`
      <div class="card">
        <h3>Allgemein</h3>
        <div class="row">
          <label>Name des Zuhauses</label>
          <lw-text-input
            .value=${this.config.household_name}
            placeholder="z.B. Haus Lindenweg"
            @change=${(e2) => this._update({ household_name: e2.detail.value })}
          ></lw-text-input>
        </div>
        <div class="row">
          <label>Theme</label>
          <select
            .value=${this.config.theme}
            @change=${(e2) => this._update({ theme: e2.target.value })}
          >
            <option value="linen">Linen (hell / warm)</option>
            <option value="walnut">Walnut (dunkel / warm)</option>
          </select>
        </div>
      </div>
    `;
  }
  // ---------- Tab: Overview ----------
  _renderOverview() {
    const ov = this.config.overview;
    return b`
      <div class="card">
        <h3>Übersicht — Kernelemente</h3>
        <div class="row">
          <label>Wetter-Entity</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["weather"]}
            .value=${ov.weather ?? ""}
            @change=${(e2) => this._patchOverview("weather", e2.detail.value || void 0)}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Kalender (heute)</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["calendar"]}
            .value=${ov.calendar ?? ""}
            @change=${(e2) => this._patchOverview("calendar", e2.detail.value || void 0)}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Alarmanlage</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["alarm_control_panel"]}
            .value=${ov.alarm_panel ?? ""}
            @change=${(e2) => this._patchOverview("alarm_panel", e2.detail.value || void 0)}
          ></lw-entity-picker>
        </div>
        <div class="row tall">
          <label>Personen (Avatare)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.presence ?? []}
            .domains=${["person"]}
            @change=${(e2) => this._patchOverview("presence", e2.detail.value)}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Szenen (Schnellzugriff)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.scenes ?? []}
            .domains=${["scene"]}
            @change=${(e2) => this._patchOverview("scenes", e2.detail.value)}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Kameras</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ov.cameras ?? []}
            .domains=${["camera"]}
            @change=${(e2) => this._patchOverview("cameras", e2.detail.value)}
          ></lw-entity-multi>
        </div>
      </div>
    `;
  }
  // ---------- Tab: Energie ----------
  _renderEnergy() {
    const energy = this.config.overview.energy ?? {};
    const set = (key, value) => {
      this._patchOverview("energy", { ...energy, [key]: value || void 0 });
    };
    const fields = [
      ["pv_now", "PV Leistung jetzt (W oder kW)"],
      ["pv_today", "PV Ertrag heute (kWh)"],
      ["consumption", "Hausverbrauch jetzt"],
      ["grid_feed", "Netz-Einspeisung"],
      ["grid_draw", "Netz-Bezug"],
      ["battery_level", "Akku Ladestand (%)"],
      ["battery_flow", "Akku Fluss (W, negativ=lädt)"]
    ];
    return b`
      <div class="card">
        <h3>Energie — Sensor-Zuordnung</h3>
        ${fields.map(
      ([k2, label]) => b`
            <div class="row">
              <label>${label}</label>
              <lw-entity-picker
                .hass=${this.hass}
                .domains=${["sensor"]}
                .value=${energy[k2] ?? ""}
                @change=${(e2) => set(k2, e2.detail.value)}
              ></lw-entity-picker>
            </div>
          `
    )}
      </div>
    `;
  }
  // ---------- Tab: Events ----------
  _renderEvents() {
    const ev = this.config.overview.events ?? {};
    const setEv = (key, value) => {
      this._patchOverview("events", { ...ev, [key]: value });
    };
    const addAppliance = () => {
      const next = [
        ...ev.appliances ?? [],
        { name: "Neues Gerät", state_entity: "" }
      ];
      setEv("appliances", next);
    };
    const updateAppliance = (i2, patch) => {
      const list = [...ev.appliances ?? []];
      list[i2] = { ...list[i2], ...patch };
      setEv("appliances", list);
    };
    const removeAppliance = (i2) => {
      const list = [...ev.appliances ?? []];
      list.splice(i2, 1);
      setEv("appliances", list);
    };
    return b`
      <div class="card">
        <h3>Geräte mit Fortschritt</h3>
        ${ev.appliances?.length ? ev.appliances.map(
      (a2, i2) => b`
                <div class="appliance-row">
                  <lw-text-input
                    .value=${a2.name}
                    placeholder="Name"
                    @change=${(e2) => updateAppliance(i2, { name: e2.detail.value })}
                  ></lw-text-input>
                  <lw-entity-picker
                    .hass=${this.hass}
                    .domains=${["sensor", "binary_sensor"]}
                    .value=${a2.state_entity}
                    placeholder="Status-Entity"
                    @change=${(e2) => updateAppliance(i2, { state_entity: e2.detail.value })}
                  ></lw-entity-picker>
                  <lw-entity-picker
                    .hass=${this.hass}
                    .domains=${["sensor"]}
                    .value=${a2.progress_entity ?? ""}
                    placeholder="Fortschritt %"
                    @change=${(e2) => updateAppliance(i2, { progress_entity: e2.detail.value || void 0 })}
                  ></lw-entity-picker>
                  <button class="del-btn" @click=${() => removeAppliance(i2)}>Entfernen</button>
                </div>
              `
    ) : ""}
        <button class="add-btn" @click=${addAppliance} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Gerät hinzufügen
        </button>
      </div>

      <div class="card">
        <h3>Abfall / Müll</h3>
        <div class="row">
          <label>Waste Collection Kalender</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["calendar"]}
            .value=${ev.waste_calendar ?? ""}
            @change=${(e2) => setEv("waste_calendar", e2.detail.value || void 0)}
          ></lw-entity-picker>
        </div>
      </div>

      <div class="card">
        <h3>Schwache Akkus</h3>
        <div class="row">
          <label>Schwelle (%)</label>
          <lw-text-input
            type="number"
            .value=${String(ev.low_battery_threshold ?? 10)}
            @change=${(e2) => setEv("low_battery_threshold", parseInt(e2.detail.value, 10) || 10)}
          ></lw-text-input>
        </div>
        <div class="hint">
          Leer lassen für Auto-Discovery: alle <code>sensor.*</code> mit
          <code>device_class: battery</code> werden überwacht.
        </div>
        <div class="row tall" style="margin-top: 14px">
          <label>Manuell wählen (optional)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${ev.battery_entities ?? []}
            .domains=${["sensor"]}
            @change=${(e2) => setEv("battery_entities", e2.detail.value)}
          ></lw-entity-multi>
        </div>
      </div>
    `;
  }
  // ---------- Tab: Radios ----------
  _renderRadios() {
    const radios = this.config.overview.radios ?? [];
    const update = (i2, patch) => {
      const list = [...radios];
      list[i2] = { ...list[i2], ...patch };
      this._patchOverview("radios", list);
    };
    const add = () => {
      this._patchOverview("radios", [...radios, { name: "Neuer Sender", url: "" }]);
    };
    const remove = (i2) => {
      const list = [...radios];
      list.splice(i2, 1);
      this._patchOverview("radios", list);
    };
    return b`
      <div class="card">
        <h3>Radio-Sender</h3>
        <div class="hint" style="margin-bottom:14px; grid-column:1">
          Klick auf eine Kachel im Musicplayer ruft <code>media_player.play_media</code> mit der
          Stream-URL auf. MP3/AAC Streams funktionieren mit den meisten Playern. Sonos akzeptiert
          auch <code>x-rincon-mp3radio://…</code> URLs.
        </div>
        ${radios.map(
      (r2, i2) => b`
            <div class="radio-row">
              <lw-text-input
                .value=${r2.name}
                placeholder="Sendername"
                @change=${(e2) => update(i2, { name: e2.detail.value })}
              ></lw-text-input>
              <lw-text-input
                type="url"
                .value=${r2.url}
                placeholder="https://stream…"
                @change=${(e2) => update(i2, { url: e2.detail.value })}
              ></lw-text-input>
              <lw-text-input
                type="url"
                .value=${r2.logo ?? ""}
                placeholder="Logo-URL (optional)"
                @change=${(e2) => update(i2, { logo: e2.detail.value || void 0 })}
              ></lw-text-input>
              <button class="del-btn" @click=${() => remove(i2)}>×</button>
            </div>
          `
    )}
        <button class="add-btn" @click=${add} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Sender hinzufügen
        </button>
      </div>
    `;
  }
  // ---------- Tab: Rooms ----------
  _renderRooms() {
    const rooms = Object.entries(this.config.rooms);
    return b`
      ${rooms.length === 0 ? b`<div class="card" style="text-align:center; color:var(--text-muted)">
            Noch keine Räume angelegt. Klick unten auf „Raum hinzufügen".
          </div>` : ""}
      ${rooms.map(([key, r2]) => this._renderRoomCard(key, r2))}
      <button class="add-btn" @click=${this._addRoom}>
        <lw-icon name="plus" .size=${14} .stroke=${2}></lw-icon>Raum hinzufügen
      </button>
    `;
  }
  _renderRoomCard(key, r2) {
    const expanded = this._expandedRoom === key;
    const counts = `${r2.lights?.length ?? 0}L · ${r2.scenes?.length ?? 0}S · ${r2.covers?.length ?? 0}R · ${r2.extras?.length ?? 0}G`;
    return b`
      <div class="room-card">
        <div
          class="room-head"
          @click=${() => this._expandedRoom = expanded ? null : key}
        >
          <div class="room-ico">
            <lw-icon name=${r2.icon ?? "cog"} .size=${17}></lw-icon>
          </div>
          <div class="room-name">${r2.name}</div>
          <div class="room-count">${counts}</div>
          <lw-icon name=${expanded ? "arrow-up" : "arrow-down"} .size=${14}></lw-icon>
        </div>
        ${expanded ? this._renderRoomBody(key, r2) : ""}
      </div>
    `;
  }
  _renderRoomBody(key, r2) {
    const extras = r2.extras ?? [];
    const updateExtra = (i2, patch) => {
      const list = [...extras];
      list[i2] = { ...list[i2], ...patch };
      this._patchRoom(key, { extras: list });
    };
    const addExtra = () => {
      this._patchRoom(key, { extras: [...extras, { kind: "generic", name: "Neues Gerät" }] });
    };
    const removeExtra = (i2) => {
      const list = [...extras];
      list.splice(i2, 1);
      this._patchRoom(key, { extras: list });
    };
    return b`
      <div class="room-body">
        <div class="row" style="margin-top:14px">
          <label>Anzeigename</label>
          <lw-text-input
            .value=${r2.name}
            @change=${(e2) => this._patchRoom(key, { name: e2.detail.value })}
          ></lw-text-input>
        </div>
        <div class="row tall">
          <label>Icon</label>
          <div class="icon-grid">
            ${ROOM_ICONS.map(
      (i2) => b`
                <button
                  class=${"icon-pick" + (r2.icon === i2 ? " active" : "")}
                  @click=${() => this._patchRoom(key, { icon: i2 })}
                  title=${i2}
                >
                  <lw-icon name=${i2} .size=${16}></lw-icon>
                </button>
              `
    )}
          </div>
        </div>
        <div class="row">
          <label>Climate-Entity</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["climate"]}
            .value=${r2.climate ?? ""}
            @change=${(e2) => this._patchRoom(key, { climate: e2.detail.value || void 0 })}
          ></lw-entity-picker>
        </div>
        <div class="row">
          <label>Media-Player</label>
          <lw-entity-picker
            .hass=${this.hass}
            .domains=${["media_player"]}
            .value=${r2.media_player ?? ""}
            @change=${(e2) => this._patchRoom(key, { media_player: e2.detail.value || void 0 })}
          ></lw-entity-picker>
        </div>
        <div class="row tall">
          <label>Szenen (1-5)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r2.scenes ?? []}
            .domains=${["scene"]}
            @change=${(e2) => this._patchRoom(key, { scenes: e2.detail.value })}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Lichter (Popup-Steuerung)</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r2.lights ?? []}
            .domains=${["light"]}
            @change=${(e2) => this._patchRoom(key, { lights: e2.detail.value })}
          ></lw-entity-multi>
        </div>
        <div class="row tall">
          <label>Rollläden / Gardinen</label>
          <lw-entity-multi
            .hass=${this.hass}
            .value=${r2.covers ?? []}
            .domains=${["cover"]}
            @change=${(e2) => this._patchRoom(key, { covers: e2.detail.value })}
          ></lw-entity-multi>
        </div>

        <h3 style="margin-top:24px">Geräte in diesem Raum</h3>
        ${extras.length > 0 ? b`
              <div class="extra-cols">
                <div>Typ</div>
                <div>Anzeigename</div>
                <div>Haupt-Entity</div>
                <div>Status-Entity (opt.)</div>
                <div></div>
              </div>
              ${extras.map(
      (x2, i2) => b`
                  <div class="extra-row">
                    <select
                      .value=${x2.kind}
                      @change=${(e2) => updateExtra(i2, { kind: e2.target.value })}
                    >
                      ${EXTRA_KINDS.map(
        (k2) => b`<option value=${k2.id} ?selected=${x2.kind === k2.id}>${k2.label}</option>`
      )}
                    </select>
                    <lw-text-input
                      .value=${x2.name}
                      placeholder="Name"
                      @change=${(e2) => updateExtra(i2, { name: e2.detail.value })}
                    ></lw-text-input>
                    <lw-entity-picker
                      .hass=${this.hass}
                      .value=${x2.entity ?? ""}
                      placeholder="entity_id"
                      @change=${(e2) => updateExtra(i2, { entity: e2.detail.value || void 0 })}
                    ></lw-entity-picker>
                    <lw-entity-picker
                      .hass=${this.hass}
                      .value=${x2.state_entity ?? ""}
                      placeholder="optional"
                      @change=${(e2) => updateExtra(i2, { state_entity: e2.detail.value || void 0 })}
                    ></lw-entity-picker>
                    <button class="del-btn" @click=${() => removeExtra(i2)}>×</button>
                  </div>
                `
    )}
            ` : ""}
        <button class="add-btn" @click=${addExtra} style="margin-top:12px">
          <lw-icon name="plus" .size=${13} .stroke=${2}></lw-icon>Gerät hinzufügen
        </button>

        <div style="display:flex; justify-content:flex-end; margin-top:18px">
          <button class="del-btn" @click=${() => this._deleteRoom(key)}>
            Raum löschen
          </button>
        </div>
      </div>
    `;
  }
  _renderTab() {
    switch (this._tab) {
      case "allgemein":
        return this._renderGeneral();
      case "overview":
        return this._renderOverview();
      case "energie":
        return this._renderEnergy();
      case "events":
        return this._renderEvents();
      case "radios":
        return this._renderRadios();
      case "rooms":
        return this._renderRooms();
    }
  }
  render() {
    return b`
      <div class="page">
        <div class="head">
          <div>
            <div class="title">Einstellungen</div>
            <div class="subtitle">
              Änderungen werden automatisch gespeichert ·
              <span class="save-indicator"><lw-icon name="check" .size=${11}></lw-icon>live sync</span>
            </div>
          </div>
          <button class="close" @click=${this._close}>
            <lw-icon name="x" .size=${13} .stroke=${2}></lw-icon> Fertig
          </button>
        </div>

        <div class="tabs">
          ${[
      ["allgemein", "Allgemein"],
      ["overview", "Übersicht"],
      ["energie", "Energie"],
      ["events", "Ereignisse"],
      ["radios", "Radio"],
      ["rooms", "Räume"]
    ].map(
      ([id, label]) => b`
              <button
                class=${"tab " + (this._tab === id ? "active" : "")}
                @click=${() => this._tab = id}
              >
                ${label}
              </button>
            `
    )}
        </div>

        <div class="content">${this._renderTab()}</div>
      </div>
    `;
  }
};
LwEditPage.styles = i$3`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .page {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }
    .head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }
    .title {
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.025em;
    }
    .subtitle {
      margin-top: 6px;
      font-size: 12.5px;
      color: var(--text-muted);
    }
    .close {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .close:hover {
      background: var(--card);
    }
    .tabs {
      display: flex;
      gap: 4px;
      background: var(--card-inset);
      padding: 3px;
      border-radius: 11px;
      width: fit-content;
      max-width: 100%;
      overflow-x: auto;
    }
    .tabs::-webkit-scrollbar {
      height: 0;
    }
    .tab {
      padding: 7px 14px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font: inherit;
      font-size: 12.5px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
    }
    .tab.active {
      background: var(--card-elev);
      color: var(--text);
      box-shadow: var(--shadow-sm);
    }

    .content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-right: 4px;
    }
    .content::-webkit-scrollbar {
      width: 6px;
    }
    .content::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 3px;
    }

    .card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 14px;
    }
    .card h3 {
      margin: 0 0 14px;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: -0.005em;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }
    .row label {
      font-size: 12.5px;
      color: var(--text);
    }
    .row.tall {
      align-items: start;
    }
    .row.tall label {
      padding-top: 6px;
    }
    .hint {
      font-size: 11px;
      color: var(--text-faint);
      margin-top: 4px;
      grid-column: 2;
    }
    select {
      width: 100%;
      padding: 8px 12px;
      background: var(--card-inset);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font: inherit;
      font-size: 13px;
    }
    .save-indicator {
      font-size: 11.5px;
      color: var(--accent);
      font-family: 'Geist Mono', monospace;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .room-card {
      background: var(--card);
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .room-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      cursor: pointer;
      user-select: none;
    }
    .room-head:hover {
      background: var(--card-inset);
    }
    .room-ico {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      background: var(--card-inset);
      color: var(--text);
      display: grid;
      place-items: center;
    }
    .room-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }
    .room-count {
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'Geist Mono', monospace;
    }
    .room-body {
      padding: 0 16px 16px;
      border-top: 1px solid var(--border-soft);
    }
    .add-btn {
      width: 100%;
      padding: 12px;
      border: 1px dashed var(--border);
      background: transparent;
      color: var(--text-muted);
      border-radius: 11px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .add-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .del-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--warn);
      padding: 6px 10px;
      border-radius: 8px;
      font: inherit;
      font-size: 11.5px;
      cursor: pointer;
    }
    .del-btn:hover {
      background: color-mix(in oklab, var(--warn) 10%, transparent);
    }
    .icon-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .icon-pick {
      width: 36px;
      height: 36px;
      border-radius: 9px;
      background: var(--card-inset);
      border: 1.5px solid transparent;
      color: var(--text-muted);
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .icon-pick:hover {
      color: var(--text);
    }
    .icon-pick.active {
      border-color: var(--accent);
      color: var(--text);
      background: color-mix(in oklab, var(--accent) 18%, var(--card-inset));
    }
    .extra-row {
      display: grid;
      grid-template-columns: 160px 1fr 1fr 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
    .extra-row:first-child {
      border-top: none;
      padding-top: 12px;
    }
    .extra-cols {
      display: grid;
      grid-template-columns: 160px 1fr 1fr 1fr auto;
      gap: 8px;
      padding: 0 0 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 500;
      color: var(--text-faint);
    }
    .radio-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
    .radio-row:first-of-type {
      border-top: none;
      padding-top: 12px;
    }
    .appliance-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1.5fr auto;
      gap: 8px;
      align-items: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-soft);
    }
  `;
__decorateClass$1([
  n2({ attribute: false })
], LwEditPage.prototype, "hass", 2);
__decorateClass$1([
  n2({ attribute: false })
], LwEditPage.prototype, "config", 2);
__decorateClass$1([
  r()
], LwEditPage.prototype, "_tab", 2);
__decorateClass$1([
  r()
], LwEditPage.prototype, "_expandedRoom", 2);
LwEditPage = __decorateClass$1([
  t("lw-edit-page")
], LwEditPage);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
let LindenwegDashboard = class extends i {
  constructor() {
    super(...arguments);
    this.narrow = false;
    this._page = "overview";
    this._time = /* @__PURE__ */ new Date();
    this._config = DEFAULT_CONFIG;
    this._editMode = false;
    this._readPageFromHash = () => {
      const m2 = location.hash.match(/#\/([\w-]+)/);
      if (m2) {
        if (m2[1] === "edit") this._editMode = true;
        else this._page = m2[1];
      }
    };
    this._navigate = (e2) => {
      this._editMode = false;
      this._page = e2.detail.page;
      location.hash = `#/${e2.detail.page}`;
    };
    this._openEdit = () => {
      this._editMode = true;
    };
    this._closeEdit = () => {
      this._editMode = false;
    };
  }
  connectedCallback() {
    super.connectedCallback();
    injectFontImport();
    this._tick = window.setInterval(() => this._time = /* @__PURE__ */ new Date(), 2e4);
    this._readPageFromHash();
    window.addEventListener("hashchange", this._readPageFromHash);
    this._unsubConfig = configStore.subscribe((cfg) => {
      this._config = cfg;
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._tick) clearInterval(this._tick);
    window.removeEventListener("hashchange", this._readPageFromHash);
    this._unsubConfig?.();
    configStore.detach();
  }
  willUpdate(changed) {
    if (changed.has("hass") && this.hass) {
      configStore.attach(this.hass);
    }
  }
  _theme() {
    return this._config.theme === "walnut" ? "walnut" : "linen";
  }
  render() {
    const config = this._config;
    const theme = this._theme();
    const room = config.rooms[this._page];
    return b`
      <div class=${"root theme-" + theme}>
        <lw-sidebar
          .hass=${this.hass}
          .config=${config}
          .page=${this._editMode ? "__edit__" : this._page}
          @navigate=${this._navigate}
          @open-config=${this._openEdit}
        ></lw-sidebar>
        <div class="main">
          ${this._editMode ? b`<lw-edit-page
                .hass=${this.hass}
                .config=${config}
                @close=${this._closeEdit}
              ></lw-edit-page>` : this._page === "overview" || !room ? b`<lw-overview-page
                  .hass=${this.hass}
                  .config=${config}
                  .time=${this._time}
                ></lw-overview-page>` : b`<lw-room-page
                  .hass=${this.hass}
                  .config=${config}
                  .roomKey=${this._page}
                  .time=${this._time}
                ></lw-room-page>`}
        </div>
      </div>
    `;
  }
};
LindenwegDashboard.styles = [
  themeLinen,
  themeWalnut,
  baseStyles,
  i$3`
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background: var(--bg);
        color: var(--text);
      }
      .root {
        display: flex;
        width: 100%;
        height: 100%;
      }
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    `
];
__decorateClass([
  n2({ attribute: false })
], LindenwegDashboard.prototype, "hass", 2);
__decorateClass([
  n2({ attribute: false })
], LindenwegDashboard.prototype, "panel", 2);
__decorateClass([
  n2({ type: Boolean })
], LindenwegDashboard.prototype, "narrow", 2);
__decorateClass([
  n2({ attribute: false })
], LindenwegDashboard.prototype, "route", 2);
__decorateClass([
  r()
], LindenwegDashboard.prototype, "_page", 2);
__decorateClass([
  r()
], LindenwegDashboard.prototype, "_time", 2);
__decorateClass([
  r()
], LindenwegDashboard.prototype, "_config", 2);
__decorateClass([
  r()
], LindenwegDashboard.prototype, "_editMode", 2);
LindenwegDashboard = __decorateClass([
  t("lindenweg-dashboard")
], LindenwegDashboard);
const VERSION = "0.2.9";
console.info(
  `%c LINDENWEG-DASHBOARD %c v${VERSION} `,
  "background:#7e8f70;color:#fbf7ee;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:600",
  "background:#2a2620;color:#ece6da;padding:2px 6px;border-radius:0 4px 4px 0"
);
//# sourceMappingURL=lindenweg-dashboard.js.map
