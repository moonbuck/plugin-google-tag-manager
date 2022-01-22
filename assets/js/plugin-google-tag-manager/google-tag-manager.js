// Make sure a data layer has been created.
window.dataLayer = window.dataLayer || [];

// Push the page kind and type into the data layer.
window.dataLayer.push({ kind: '{{ .Kind }}', type: '{{ .Type }}' });

{{- /* Handle post specific data. */ -}}
{{ if (eq "post" .Type) -}}

  {{- with .ReadingTime -}}
// Push the estimated reading time values for posts.
window.dataLayer.push({
  est_reading_min: {{ . }},
  est_reading_ms_100: {{ mul . 60000 }},
  est_reading_ms_75: {{ mul . 45000 }},
  est_reading_ms_50: {{ mul . 30000 }},
  est_reading_ms_25: {{ mul . 15000 }}
 });
  {{- end -}}
  
  {{ with .Params.categories -}}
// Push the page categories into the data layer.
window.dataLayer.push({ post_categories: {{ apply . "urlize" "." }} });
  {{- end }}

  {{ with .Title -}}
// Push the title into the data layer.
window.dataLayer.push({ post_title: '{{ . }}' });
  {{ end -}}

{{- /* Handle taxonomy pages */ -}}
{{- else if (eq .Kind "taxonomy") -}}

  {{ with .Pages -}}
    {{- $page_count := len . -}}
    {{- with site.Params.paginate -}}
      {{- if (lt . $page_count) }}{{ $page_count = . }}{{ end -}}
    {{- end -}}
// Push the page count into the data layer.
window.dataLayer.push({ page_count: {{ $page_count }} });
  {{- end }}
  
  {{ with .Dir -}}
// Push the category name into the data layer.
window.dataLayer.push({ taxonomy_category: '{{ path.Base . }}'});
  {{- end }}
  
{{- /* Handle the home page. */ -}}
{{- else if .IsHome -}}
  
  {{ with .Pages -}}
    {{- $page_count := len . -}}
    {{- with site.Params.paginate -}}
      {{- if (lt . $page_count) }}{{ $page_count = . }}{{ end -}}
    {{- end -}}
// Push the page count into the data layer.
window.dataLayer.push({ page_count: {{ $page_count }} });
  {{- end }}
{{- end -}}

{{- with (.Scratch.Get "plugin-google-tag-manager.Parameters").Config -}}

// Invoke the tag manager code.
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window, document, 'script', 'dataLayer', '{{ .ContainerID }}');

{{- end }}